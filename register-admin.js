const registerAdmin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Admin User',
        email: 'VB5100@gmail.com',
        password: 'vbl@2611',
        phone: '+919876543210'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Admin account created successfully:', data);
      return { success: true, data };
    } else {
      console.log('Registration response:', data);
      return { success: false, error: data.message || 'Registration failed' };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};

// Call the function
registerAdmin().then(result => {
  if (result.success) {
    console.log('✅ Admin account is ready!');
    console.log('Email: VB5100@gmail.com');
    console.log('Password: vbl@2611');
    console.log('Access the notepad through: Login → Footer → Disclaimer');
  } else {
    console.log('❌ Registration failed:', result.error);
  }
});