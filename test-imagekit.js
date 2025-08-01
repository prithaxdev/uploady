// Simple test script to verify ImageKit configuration
// Run with: node test-imagekit.js

const fs = require('fs');
const path = require('path');

// Load environment variables manually
function loadEnvFile(filename) {
  try {
    const envPath = path.join(__dirname, filename);
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          process.env[key.trim()] = value;
        }
      }
    });
  } catch (error) {
    // File doesn't exist, skip
  }
}

// Load .env.local first, then .env
loadEnvFile('.env.local');
loadEnvFile('.env');

const ImageKit = require('imagekit');

console.log('Testing ImageKit configuration...');
console.log('Environment variables check:');
console.log('IMAGEKIT_PUBLIC_KEY:', process.env.IMAGEKIT_PUBLIC_KEY ? 'Set' : 'Missing');
console.log('IMAGEKIT_PRIVATE_KEY:', process.env.IMAGEKIT_PRIVATE_KEY ? 'Set' : 'Missing');
console.log('IMAGEKIT_URL_ENDPOINT:', process.env.IMAGEKIT_URL_ENDPOINT ? 'Set' : 'Missing');

if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
  console.error('❌ Missing required environment variables');
  console.log('\nPlease update your .env.local file with your complete ImageKit credentials:');
  console.log('1. Go to https://imagekit.io/dashboard');
  console.log('2. Navigate to Developer Options');
  console.log('3. Copy your Public Key, Private Key, and URL Endpoint');
  console.log('4. Update .env.local with the complete values');
  process.exit(1);
}

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Test authentication by listing files
imagekit.listFiles({
  limit: 1
}, function(error, result) {
  if (error) {
    console.error('❌ ImageKit authentication failed:', error);
    console.log('\nCommon issues:');
    console.log('- Private key is incomplete or incorrect');
    console.log('- Public key is incorrect');
    console.log('- URL endpoint is incorrect');
    console.log('- Network connectivity issues');
  } else {
    console.log('✅ ImageKit authentication successful!');
    console.log('Account info:', {
      endpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      filesFound: result.length
    });
  }
});