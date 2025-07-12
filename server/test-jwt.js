const jwt = require('jsonwebtoken');
require('dotenv').config();

// Test JWT functionality
const testJWT = () => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    console.error('❌ JWT_SECRET not found in environment variables');
    return;
  }
  
  console.log('✅ JWT_SECRET found:', secret.substring(0, 20) + '...');
  
  // Test token generation
  const payload = { id: 'test-user-id', email: 'test@example.com' };
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  
  console.log('✅ Token generated successfully');
  console.log('📝 Sample token:', token.substring(0, 50) + '...');
  
  // Test token verification
  try {
    const decoded = jwt.verify(token, secret);
    console.log('✅ Token verified successfully');
    console.log('🔍 Decoded payload:', decoded);
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
  }
  
  // Test with wrong secret
  try {
    jwt.verify(token, 'wrong-secret');
    console.error('❌ Token should not verify with wrong secret');
  } catch (error) {
    console.log('✅ Correctly rejected token with wrong secret');
  }
};

testJWT(); 