require('dotenv').config();

console.log('🔍 Redirect URL Test');
console.log('=====================');

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
const redirectUrl = `${clientUrl}/auth/google-callback?token=test-token`;

console.log('📋 Environment Variables:');
console.log('- CLIENT_URL:', clientUrl);
console.log('- Generated redirect URL:', redirectUrl);

console.log('\n💡 Make sure your client is running on the correct port!');
console.log('- If using Vite (default): http://localhost:5173');
console.log('- If using Create React App: http://localhost:3000');
console.log('- Check your client terminal for the actual port'); 