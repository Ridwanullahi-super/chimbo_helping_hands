-- MySQL-Compatible NGO Website Schema

-- Use your database
USE your_database_name;

-- USERS table
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  country VARCHAR(100),
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- DONATIONS table
CREATE TABLE IF NOT EXISTS donations (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36),
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
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- BLOGS table
CREATE TABLE IF NOT EXISTS blogs (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author_id CHAR(36) NOT NULL,
  status ENUM('draft', 'published') DEFAULT 'draft',
  tags JSON,
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- EVENTS table
CREATE TABLE IF NOT EXISTS events (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATETIME NOT NULL,
  location VARCHAR(255),
  image TEXT,
  status ENUM('upcoming', 'ongoing', 'completed') DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TESTIMONIALS table
CREATE TABLE IF NOT EXISTS testimonials (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  content TEXT NOT NULL,
  image TEXT,
  rating TINYINT DEFAULT 5,
  is_featured BOOLEAN DEFAULT FALSE,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- CONTENT table
CREATE TABLE IF NOT EXISTS content (
  id CHAR(36) PRIMARY KEY,
  key_name VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255),
  content TEXT,
  type ENUM('text', 'html', 'json') DEFAULT 'text',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- PAYMENT_LOGS table
CREATE TABLE IF NOT EXISTS payment_logs (
  id CHAR(36) PRIMARY KEY,
  donation_id CHAR(36),
  payment_gateway VARCHAR(100) NOT NULL,
  transaction_id VARCHAR(255),
  gateway_response JSON,
  status VARCHAR(50),
  amount DECIMAL(10,2),
  currency VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE
);

-- INDEXES
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_donations_status ON donations(payment_status);
CREATE INDEX idx_donations_created_at ON donations(created_at);
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_author_id ON blogs(author_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_testimonials_status ON testimonials(status);
CREATE INDEX idx_content_key_name ON content(key_name);
CREATE INDEX idx_payment_logs_donation_id ON payment_logs(donation_id);

-- SAMPLE INSERT: Admin user
INSERT INTO users (id, email, password, first_name, last_name, role)
VALUES (
  UUID(),
  'admin@chimbohelpinghands.org',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJjd4rJZm',
  'Admin',
  'User',
  'admin'
)
ON DUPLICATE KEY UPDATE email = email;

-- Sample content
INSERT IGNORE INTO content (id, key_name, title, content, type) VALUES
(UUID(), 'hero_title', 'Hero Title', 'Making a Difference Together', 'text'),
(UUID(), 'hero_subtitle', 'Hero Subtitle', 'Join Chimbo Helping Hands in our mission...', 'text'),
(UUID(), 'mission_statement', 'Mission Statement', 'To empower communities worldwide...', 'text'),
(UUID(), 'vision_statement', 'Vision Statement', 'A world where every person has access...', 'text'),
(UUID(), 'about_description', 'About Description', 'Chimbo Helping Hands was founded in 2015...', 'text');

-- Sample testimonials
INSERT IGNORE INTO testimonials (id, name, role, content, image, rating, status) VALUES
(UUID(), 'Sarah Johnson', 'Monthly Donor', 'Chimbo Helping Hands has shown me...', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg', 5, 'approved'),
(UUID(), 'Michael Chen', 'Volunteer Coordinator', 'Working with this organization...', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg', 5, 'approved'),
(UUID(), 'Dr. Amara Okafor', 'Community Partner', 'As a local healthcare provider...', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', 5, 'approved');

-- Sample events
INSERT IGNORE INTO events (id, title, description, event_date, location, status) VALUES
(UUID(), 'Annual Fundraising Gala', 'Join us for an evening of celebration...', '2024-03-15 18:00:00', 'New York Community Center', 'upcoming'),
(UUID(), 'Water Well Project Launch', 'Launching our new water well project...', '2024-02-20 10:00:00', 'Kenya', 'ongoing'),
(UUID(), 'Education Program Graduation', 'Celebrating the graduation of 200 students...', '2024-01-10 14:00:00', 'Guatemala', 'completed');
