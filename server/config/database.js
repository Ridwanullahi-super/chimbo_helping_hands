const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'chimbo_helping_hands',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  multipleStatements: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection and create database if it doesn't exist
async function testConnection() {
  try {
    // First, try to connect without specifying a database
    const tempConfig = { ...dbConfig };
    delete tempConfig.database;
    const tempPool = mysql.createPool(tempConfig);
    
    const tempConnection = await tempPool.getConnection();
    
    // Create database if it doesn't exist
    await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'chimbo_helping_hands'}\``);
    console.log(`✅ Database '${process.env.DB_NAME || 'chimbo_helping_hands'}' ensured to exist`);
    
    tempConnection.release();
    await tempPool.end();
    
    // Now test connection with the actual database
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your .env file settings:');
    console.log('   - DB_HOST=' + (process.env.DB_HOST || 'localhost'));
    console.log('   - DB_USER=' + (process.env.DB_USER || 'root'));
    console.log('   - DB_PASSWORD=' + (process.env.DB_PASSWORD ? '[SET]' : '[NOT SET]'));
    console.log('   - DB_NAME=' + (process.env.DB_NAME || 'chimbo_helping_hands'));
    console.log('3. Verify MySQL credentials are correct');
    return false;
  }
}

// Initialize database with tables if they don't exist
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        country VARCHAR(100),
        role ENUM('user', 'admin') DEFAULT 'user',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_users_email (email),
        INDEX idx_users_role (role)
      )
    `);

    // Create donations table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        frequency ENUM('one-time', 'monthly') DEFAULT 'one-time',
        payment_method ENUM('stripe', 'paypal', 'flutterwave') NOT NULL,
        payment_status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
        payment_id VARCHAR(255),
        donor_name VARCHAR(255) NOT NULL,
        donor_email VARCHAR(255) NOT NULL,
        donor_phone VARCHAR(20),
        donor_address TEXT,
        donor_city VARCHAR(100),
        donor_zip VARCHAR(20),
        donor_country VARCHAR(100),
        is_anonymous BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_donations_user_id (user_id),
        INDEX idx_donations_status (payment_status),
        INDEX idx_donations_created_at (created_at)
      )
    `);

    // Create blogs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        featured_image TEXT,
        author_id INT NOT NULL,
        status ENUM('draft', 'published') DEFAULT 'draft',
        tags JSON,
        meta_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_blogs_slug (slug),
        INDEX idx_blogs_status (status),
        INDEX idx_blogs_author_id (author_id)
      )
    `);

    // Create events table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date DATETIME NOT NULL,
        location VARCHAR(255),
        image TEXT,
        status ENUM('upcoming', 'ongoing', 'completed') DEFAULT 'upcoming',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_events_date (event_date),
        INDEX idx_events_status (status)
      )
    `);

    // Create testimonials table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        content TEXT NOT NULL,
        image TEXT,
        rating TINYINT DEFAULT 5,
        is_featured BOOLEAN DEFAULT FALSE,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_testimonials_status (status),
        INDEX idx_testimonials_featured (is_featured)
      )
    `);

    // Create content table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        key_name VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255),
        content TEXT,
        type ENUM('text', 'html', 'json') DEFAULT 'text',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_content_key_name (key_name),
        INDEX idx_content_active (is_active)
      )
    `);

    // Create payment_logs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payment_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        donation_id INT,
        payment_gateway VARCHAR(100) NOT NULL,
        transaction_id VARCHAR(255),
        gateway_response JSON,
        status VARCHAR(50),
        amount DECIMAL(10,2),
        currency VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE,
        INDEX idx_payment_logs_donation_id (donation_id),
        INDEX idx_payment_logs_gateway (payment_gateway)
      )
    `);

    // Insert default admin user if not exists
    const [adminExists] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@chimbohelpinghands.org']
    );

    if (adminExists.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await connection.execute(`
        INSERT INTO users (email, password, first_name, last_name, role) 
        VALUES (?, ?, ?, ?, ?)
      `, ['admin@chimbohelpinghands.org', hashedPassword, 'Admin', 'User', 'admin']);
      
      console.log('✅ Default admin user created');
    }

    // Insert sample data if tables are empty
    const [blogCount] = await connection.execute('SELECT COUNT(*) as count FROM blogs');
    if (blogCount[0].count === 0) {
      await insertSampleData(connection);
    }

    connection.release();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

async function insertSampleData(connection) {
  try {
    // Get admin user ID
    const [adminUser] = await connection.execute(
      'SELECT id FROM users WHERE role = ? LIMIT 1',
      ['admin']
    );
    
    if (adminUser.length === 0) return;
    
    const adminId = adminUser[0].id;

    // Insert sample blogs
    await connection.execute(`
      INSERT INTO blogs (title, slug, content, excerpt, author_id, status, featured_image, tags) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Building Wells in Rural Kenya',
      'building-wells-rural-kenya',
      '<p>Our latest water project in rural Kenya has successfully provided clean water access to over 500 families. This initiative represents months of planning, community engagement, and collaborative effort...</p>',
      'Learn about our successful water well project that brought clean water to 500+ families in rural Kenya.',
      adminId,
      'published',
      'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
      JSON.stringify(['water', 'kenya', 'community']),
      
      'Education Changes Everything',
      'education-changes-everything',
      '<p>Education is the foundation of sustainable development. Through our education programs, we have seen firsthand how access to quality education transforms not just individual lives, but entire communities...</p>',
      'Discover how our education programs are transforming communities and creating lasting change.',
      adminId,
      'published',
      'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800',
      JSON.stringify(['education', 'community', 'development']),
      
      'Healthcare Outreach Success',
      'healthcare-outreach-success',
      '<p>Our mobile healthcare units have reached remote communities, providing essential medical services to those who need it most. This quarter, we served over 2,000 patients across 15 villages...</p>',
      'Read about our mobile healthcare initiative that served 2,000+ patients in remote villages.',
      adminId,
      'published',
      'https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg?auto=compress&cs=tinysrgb&w=800',
      JSON.stringify(['healthcare', 'outreach', 'community'])
    ]);

    // Insert sample testimonials
    await connection.execute(`
      INSERT INTO testimonials (name, role, content, image, rating, status, is_featured) VALUES
      (?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?)
    `, [
      'Sarah Johnson',
      'Monthly Donor',
      'Chimbo Helping Hands has shown me how my small monthly donation can create real change. The transparency and regular updates make me feel truly connected to the impact.',
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
      5,
      'approved',
      true,
      
      'Michael Chen',
      'Volunteer Coordinator',
      'Working with this organization has been life-changing. Their approach to community development is thoughtful, sustainable, and truly makes a difference.',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
      5,
      'approved',
      true,
      
      'Dr. Amara Okafor',
      'Community Partner',
      'As a local healthcare provider, I have seen firsthand how Chimbo Helping Hands transforms communities. They listen, they care, and they deliver results.',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
      5,
      'approved',
      true
    ]);

    // Insert sample events
    await connection.execute(`
      INSERT INTO events (title, description, event_date, location, image, status) VALUES
      (?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?)
    `, [
      'Annual Fundraising Gala',
      'Join us for an evening of celebration and fundraising to support our global initiatives.',
      '2024-03-15 18:00:00',
      'New York Community Center',
      'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600',
      'upcoming',
      
      'Water Well Project Launch',
      'Launching our new water well project in rural Kenya.',
      '2024-02-20 10:00:00',
      'Kenya',
      'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=600',
      'ongoing',
      
      'Education Program Graduation',
      'Celebrating the graduation of 200 students from our education program.',
      '2024-01-10 14:00:00',
      'Guatemala',
      'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=600',
      'completed'
    ]);

    // Insert sample content
    await connection.execute(`
      INSERT INTO content (key_name, title, content, type) VALUES
      (?, ?, ?, ?),
      (?, ?, ?, ?),
      (?, ?, ?, ?),
      (?, ?, ?, ?),
      (?, ?, ?, ?)
    `, [
      'hero_title',
      'Hero Title',
      'Making a Difference Together',
      'text',
      
      'hero_subtitle',
      'Hero Subtitle',
      'Join Chimbo Helping Hands in our mission to create positive change in communities worldwide.',
      'text',
      
      'mission_statement',
      'Mission Statement',
      'To empower communities worldwide by providing essential resources, education, and support to those in need.',
      'text',
      
      'vision_statement',
      'Vision Statement',
      'A world where every person has access to basic necessities, quality education, and opportunities to thrive.',
      'text',
      
      'about_description',
      'About Description',
      'Chimbo Helping Hands was founded in 2015 by passionate individuals dedicated to creating positive change.',
      'text'
    ]);

    console.log('✅ Sample data inserted successfully');
  } catch (error) {
    console.error('❌ Failed to insert sample data:', error);
  }
}

module.exports = {
  pool,
  testConnection,
  initializeDatabase
};