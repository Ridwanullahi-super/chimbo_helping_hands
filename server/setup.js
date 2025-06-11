const { testConnection, initializeDatabase } = require('./config/database');
require('dotenv').config();

async function setup() {
  console.log('🚀 Setting up Chimbo Helping Hands Database...\n');
  
  try {
    // Test connection
    console.log('📡 Testing database connection...');
    const connected = await testConnection();
    
    if (!connected) {
      console.log('\n❌ Database setup failed. Please check your configuration:');
      console.log('1. Make sure MySQL is running');
      console.log('2. Check your .env file settings:');
      console.log('   - DB_HOST=' + (process.env.DB_HOST || 'localhost'));
      console.log('   - DB_USER=' + (process.env.DB_USER || 'root'));
      console.log('   - DB_PASSWORD=' + (process.env.DB_PASSWORD ? '[SET]' : '[NOT SET]'));
      console.log('   - DB_NAME=' + (process.env.DB_NAME || 'chimbo_helping_hands'));
      console.log('3. Create the database if it doesn\'t exist');
      process.exit(1);
    }
    
    // Initialize database
    console.log('🔧 Initializing database tables...');
    await initializeDatabase();
    
    console.log('\n✅ Database setup completed successfully!');
    console.log('\n📋 Default Admin Credentials:');
    console.log('   Email: admin@chimbohelpinghands.org');
    console.log('   Password: admin123');
    console.log('\n🚀 You can now start the server with: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup();