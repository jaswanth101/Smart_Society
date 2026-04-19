const axios = require('axios');

async function testApi() {
  try {
    const res = await axios.post('http://localhost:8000/api/v1/Auth/login', {
      email: "jaswanthvanapalli12@gmail.com",
      password: "1234567890"
    });
    
    const token = res.data.access_token;
    
    const onboardRes = await axios.post('http://localhost:8000/api/v1/tenants', {
      name: "Cape Town",
      slug: "cape-town",
      address: "Vizag",
      city: "Visakhapatnam",
      totalUnits: 50,
      subscriptionTier: "PREMIUM",
      subscriptionPrice: 15000,
      adminName: "D Rajesh",
      adminEmail: "rajeshin32@gmail.com",
      adminPhone: "+91 93489 14866"
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("Success:", onboardRes.data);
  } catch (err) {
    if (err.response) {
      console.error("Backend Error:", err.response.data);
    } else {
      console.error("Network/Other Error:", err.message);
    }
  }
}

testApi();
