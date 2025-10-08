const fs = require('fs');

const config = `const CONFIG = {
  emailjs: {
    userId: '${process.env.EMAILJS_USER_ID || 'meg4J4AQQC2cLw0IZ'}',
    serviceId: '${process.env.EMAILJS_SERVICE_ID || 'service_2siva'}',
    templateId: '${process.env.EMAILJS_TEMPLATE_ID || 'template_km0s0xk'}'
  }
};`;

fs.writeFileSync('config.js', config);
console.log('config.js generated successfully');
