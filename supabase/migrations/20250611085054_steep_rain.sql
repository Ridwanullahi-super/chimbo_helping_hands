-- Chimbo Helping Hands NGO Database Schema
-- MySQL Database Setup

-- Create database
CREATE DATABASE IF NOT EXISTS chimbo_helping_hands;
USE chimbo_helping_hands;

-- USERS table
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
);

-- DONATIONS table
CREATE TABLE IF NOT EXISTS donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  amount DECIMAL(10,2) NOT NULL,
  currency ENUM('USD', 'NGN', 'EUR', 'GBP', 'CAD') DEFAULT 'USD',
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
);

-- BLOGS table
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
);

-- EVENTS table
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
);

-- TESTIMONIALS table
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
);

-- CONTENT table (for dynamic content management)
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
);

-- PAYMENT_LOGS table
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
);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES (
  'admin@chimbohelpinghands.org',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJjd4rJZm',
  'Admin',
  'User',
  'admin'
) ON DUPLICATE KEY UPDATE email = email;

-- Insert sample content
INSERT IGNORE INTO content (key_name, title, content, type) VALUES
('hero_title', 'Hero Title', 'Making a Difference Together', 'text'),
('hero_subtitle', 'Hero Subtitle', 'Join Chimbo Helping Hands in our mission to create positive change in communities worldwide. Every donation, no matter the size, helps us build a better tomorrow.', 'text'),
('mission_statement', 'Mission Statement', 'To empower communities worldwide by providing essential resources, education, and support to those in need, creating sustainable positive change that lasts for generations.', 'text'),
('vision_statement', 'Vision Statement', 'A world where every person has access to basic necessities, quality education, and opportunities to thrive, regardless of their background or circumstances.', 'text'),
('about_description', 'About Description', 'Chimbo Helping Hands was founded in 2015 by a group of passionate individuals who witnessed firsthand the challenges faced by underserved communities around the world. What started as a small local initiative has grown into a global movement for positive change.', 'text');

-- Insert sample testimonials
INSERT IGNORE INTO testimonials (name, role, content, image, rating, status, is_featured) VALUES
('Sarah Johnson', 'Monthly Donor', 'Chimbo Helping Hands has shown me how my small monthly donation can create real change. The transparency and regular updates make me feel truly connected to the impact.', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300', 5, 'approved', TRUE),
('Michael Chen', 'Volunteer Coordinator', 'Working with this organization has been life-changing. Their approach to community development is thoughtful, sustainable, and truly makes a difference.', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300', 5, 'approved', TRUE),
('Dr. Amara Okafor', 'Community Partner', 'As a local healthcare provider, I have seen firsthand how Chimbo Helping Hands transforms communities. They listen, they care, and they deliver results.', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300', 5, 'approved', TRUE);

-- Insert sample events
INSERT IGNORE INTO events (title, description, event_date, location, image, status) VALUES
('Annual Fundraising Gala', 'Join us for an evening of celebration and fundraising to support our global initiatives. Featuring dinner, entertainment, and inspiring stories from the communities we serve.', '2024-03-15 18:00:00', 'New York Community Center', 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600', 'upcoming'),
('Water Well Project Launch', 'Launching our new water well project in rural Kenya. This initiative will provide clean water access to over 1,000 families in the region.', '2024-02-20 10:00:00', 'Kenya', 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=600', 'ongoing'),
('Education Program Graduation', 'Celebrating the graduation of 200 students from our education program in Guatemala. These students will now have access to higher education opportunities.', '2024-01-10 14:00:00', 'Guatemala', 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=600', 'completed');

-- Insert sample blog posts
INSERT IGNORE INTO blogs (title, slug, content, excerpt, author_id, status, featured_image) VALUES
('Building Wells in Rural Kenya', 'building-wells-rural-kenya', 'Our latest water project in rural Kenya has successfully provided clean water access to over 500 families. This initiative represents months of planning, community engagement, and collaborative effort...', 'Learn about our successful water well project that brought clean water to 500+ families in rural Kenya.', 1, 'published', 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Education Changes Everything', 'education-changes-everything', 'Education is the foundation of sustainable development. Through our education programs, we have seen firsthand how access to quality education transforms not just individual lives, but entire communities...', 'Discover how our education programs are transforming communities and creating lasting change.', 1, 'published', 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Healthcare Outreach Success', 'healthcare-outreach-success', 'Our mobile healthcare units have reached remote communities, providing essential medical services to those who need it most. This quarter, we served over 2,000 patients across 15 villages...', 'Read about our mobile healthcare initiative that served 2,000+ patients in remote villages.', 1, 'published', 'https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg?auto=compress&cs=tinysrgb&w=800');

COMMIT;