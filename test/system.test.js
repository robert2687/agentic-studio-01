/**
 * System Test for Firebase Studio
 * Tests core application functionality
 */

const { execSync } = require('child_process');
const http = require('http');

// Test configuration
const TEST_PORT = 3001;
const TEST_TIMEOUT = 30000;

async function waitForServer(port, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${port}`, resolve);
        req.on('error', reject);
        req.setTimeout(1000);
      });
      return true;
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  throw new Error(`Server not ready on port ${port} after ${timeout}ms`);
}

async function runSystemTest() {
  console.log('🚀 Starting Firebase Studio System Test');
  
  let serverProcess;
  
  try {
    // Build the application
    console.log('📦 Building application...');
    execSync('npm run build', { stdio: 'inherit', cwd: process.cwd() });
    
    // Start the server
    console.log('🌐 Starting server...');
    serverProcess = require('child_process').spawn('npm', ['start', '--', '-p', TEST_PORT], {
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    // Wait for server to be ready
    await waitForServer(TEST_PORT);
    console.log('✅ Server is running');
    
    // Test homepage accessibility
    const response = await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:${TEST_PORT}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      });
      req.on('error', reject);
      req.setTimeout(5000);
    });
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    if (!response.data.includes('Agentic Studio')) {
      throw new Error('Homepage does not contain expected content');
    }
    
    console.log('✅ Homepage loads correctly');
    console.log('✅ All system tests passed!');
    
  } catch (error) {
    console.error('❌ System test failed:', error.message);
    process.exit(1);
  } finally {
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

// Run the test
runSystemTest().catch(console.error);