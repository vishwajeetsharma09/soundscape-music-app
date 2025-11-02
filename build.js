const { execSync } = require('child_process');
const path = require('path');

console.log('🔨 Building SoundScape for production...');

try {
  // Change to frontend directory
  const frontendDir = path.join(__dirname, 'frontend');
  process.chdir(frontendDir);
  
  console.log('📦 Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('🏗️ Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}