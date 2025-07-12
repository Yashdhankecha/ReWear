require('dotenv').config();

console.log('🔍 Google OAuth Configuration Test');
console.log('=====================================');

// Check environment variables
const requiredVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'JWT_SECRET'
];

console.log('\n📋 Environment Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: Not set`);
  }
});

// Check callback URL
const callbackUrl = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';
console.log(`\n🔄 Callback URL: ${callbackUrl}`);

// Test passport configuration
try {
  const passport = require('./config/passport');
  console.log('\n✅ Passport configuration loaded successfully');
} catch (error) {
  console.log('\n❌ Passport configuration error:', error.message);
}

// Test JWT functionality
try {
  const jwt = require('jsonwebtoken');
  const testToken = jwt.sign({ test: 'data' }, process.env.JWT_SECRET);
  console.log('\n✅ JWT functionality working');
} catch (error) {
  console.log('\n❌ JWT error:', error.message);
}

console.log('\n📝 Next Steps:');
console.log('1. Make sure all environment variables are set');
console.log('2. Verify Google Cloud Console configuration');
console.log('3. Check that redirect URI matches exactly');
console.log('4. Ensure Google+ API is enabled'); 