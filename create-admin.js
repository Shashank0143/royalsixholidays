// Admin Account Registration Script
const https = require('https');
const http = require('http');

const adminData = {
  name: 'Admin User',
  email: 'VB5100@gmail.com',
  password: 'Vbl@2611',
  phone: '+919876543210'
};

const postData = JSON.stringify(adminData);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🔄 Creating admin account...');
console.log('📧 Email:', adminData.email);
console.log('🔑 Password:', adminData.password);

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('✅ Admin account created successfully!');
        console.log('🎯 Response:', response.message);
        console.log('\n📝 How to access the admin notepad:');
        console.log('1. Go to http://localhost:3000/auth/login');
        console.log('2. Login with VB5100@gmail.com / vbl@2611');
        console.log('3. Scroll to footer and click "Disclaimer"');
        console.log('4. Click "🔓 Access Secure Notepad"');
        console.log('\n🎨 Notepad features:');
        console.log('• 8 color themes');
        console.log('• 24-hour auto-delete');
        console.log('• Back button with complete logout');
        console.log('• Real-time stats and timer');
      } else {
        console.log('⚠️ Registration response:', response);
        if (response.message && response.message.includes('already exists')) {
          console.log('✅ Admin account already exists - you can proceed to login!');
        }
      }
    } catch (error) {
      console.log('📄 Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Error creating admin account:', error.message);
  console.log('💡 Make sure the server is running on port 5000');
});

req.write(postData);
req.end();