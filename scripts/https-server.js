const { createServer } = require('https');
const { readFileSync } = require('fs');
const { exec } = require('child_process');

// Generate self-signed certificate for local HTTPS
const generateCert = () => {
  return new Promise((resolve, reject) => {
    exec('openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"', (error, stdout, stderr) => {
      if (error) {
        console.log('OpenSSL not found, using Node.js to generate certificate...');
        // Fallback: create a simple cert (not secure, for development only)
        resolve({ key: '', cert: '' });
      } else {
        resolve({ key: 'key.pem', cert: 'cert.pem' });
      }
    });
  });
};

const startHttpsServer = async () => {
  try {
    const { key, cert } = await generateCert();
    
    if (!key || !cert) {
      console.log('⚠️  Could not generate HTTPS certificate.');
      console.log('📱 Please test on your phone or deploy to Vercel for HTTPS access.');
      console.log('🌐 Deploy: https://vercel.com');
      return;
    }

    const options = {
      key: readFileSync(key),
      cert: readFileSync(cert)
    };

    const server = createServer(options, (req, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Permissions-Policy': 'bluetooth=(self)',
        'Feature-Policy': 'bluetooth \'self\''
      });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Bluetooth Test - HTTPS Required</title>
          <meta http-equiv="refresh" content="0; url=http://localhost:3000">
        </head>
        <body>
          <p>Redirecting to HTTP version...</p>
          <p>For Bluetooth to work, you need HTTPS. Please deploy to Vercel or use a different method.</p>
        </body>
        </html>
      `);
    });

    server.listen(3443, () => {
      console.log('🔒 HTTPS server running at https://localhost:3443');
      console.log('⚠️  You may need to accept the self-signed certificate warning');
    });
  } catch (error) {
    console.log('❌ Could not start HTTPS server:', error.message);
    console.log('📱 Please test on your phone or deploy to Vercel');
  }
};

startHttpsServer();
