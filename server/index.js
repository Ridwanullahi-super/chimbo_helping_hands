const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { testConnection, initializeDatabase } = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/events', require('./routes/events'));
app.use('/api/content', require('./routes/content'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/testimonials', require('./routes/testimonials'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Chimbo Helping Hands API Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Chimbo Helping Hands API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      blogs: '/api/blogs',
      donations: '/api/donations',
      admin: '/api/admin'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🚀 Starting Chimbo Helping Hands API Server...');
    console.log('📍 Environment:', process.env.NODE_ENV || 'development');
    console.log('🔌 Port:', PORT);
    console.log('🌐 Frontend URL:', process.env.FRONTEND_URL || 'http://localhost:3000');
    
    // Test database connection
    console.log('📡 Testing database connection...');
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('\n❌ Failed to connect to database.');
      console.log('🔧 To fix this issue:');
      console.log('1. Make sure MySQL is installed and running');
      console.log('2. Run: cd server && node setup.js');
      console.log('3. Check your .env file configuration');
      process.exit(1);
    }
    
    // Initialize database tables
    console.log('🔧 Initializing database tables...');
    await initializeDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log('\n✅ Server started successfully!');
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API docs: http://localhost:${PORT}/`);
      console.log('\n📋 Default Admin Credentials:');
      console.log('   Email: admin@chimbohelpinghands.org');
      console.log('   Password: admin123');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('\n🔧 Development mode active');
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if MySQL is running');
    console.log('2. Verify database credentials in .env file');
    console.log('3. Run: cd server && node setup.js');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();