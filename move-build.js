const fs = require('fs');
const path = require('path');

// Prevent running during development
if (process.env.NODE_ENV !== 'production') {
  console.warn('⚠️  move-build.js should only be run after a production build. Skipping move.');
  process.exit(0);
}

// Configuration - Single source of truth for build destination
const BUILD_CONFIG = {
  sourceDir: path.join(__dirname, process.env.VERCEL ? '.next' : 'build'),
  baseDestDir: 'C:/Users/CUSTOM PC/Desktop/cursor builds',
  maxBuilds: 5 // Keep only last 5 builds
};

console.log('🚀 Starting build move process...');
console.log(`📁 Source: ${BUILD_CONFIG.sourceDir}`);
console.log(`📁 Destination base: ${BUILD_CONFIG.baseDestDir}`);

// Validate source build exists
if (!fs.existsSync(BUILD_CONFIG.sourceDir)) {
  console.error('❌ ERROR: Build directory not found!');
  console.error(`   Expected: ${BUILD_CONFIG.sourceDir}`);
  console.error('   Make sure "npm run build" completed successfully first.');
  process.exit(1);
}

// Create timestamp for unique directory name
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const destDir = path.join(BUILD_CONFIG.baseDestDir, `build-${timestamp}`);

console.log(`📅 Timestamp: ${timestamp}`);
console.log(`🎯 Target: ${destDir}`);

try {
  // Ensure base directory exists
  if (!fs.existsSync(BUILD_CONFIG.baseDestDir)) {
    console.log('📂 Creating base directory...');
    fs.mkdirSync(BUILD_CONFIG.baseDestDir, { recursive: true });
  }

  // Move build to timestamped directory
  console.log('📦 Moving build files...');
  fs.renameSync(BUILD_CONFIG.sourceDir, destDir);
  
  console.log('✅ Build moved successfully!');
  console.log(`📍 Location: ${destDir}`);

  // Cleanup old builds (keep only last 5)
  console.log('🧹 Cleaning up old builds...');
  const builds = fs.readdirSync(BUILD_CONFIG.baseDestDir)
    .filter(dir => dir.startsWith('build-'))
    .sort()
    .reverse();

  if (builds.length > BUILD_CONFIG.maxBuilds) {
    const buildsToRemove = builds.slice(BUILD_CONFIG.maxBuilds);
    buildsToRemove.forEach(oldBuild => {
      const oldPath = path.join(BUILD_CONFIG.baseDestDir, oldBuild);
      fs.rmSync(oldPath, { recursive: true, force: true });
      console.log(`🗑️  Removed: ${oldBuild}`);
    });
  }

  console.log(`📊 Total builds kept: ${Math.min(builds.length, BUILD_CONFIG.maxBuilds)}`);
  console.log('🎉 Build process completed successfully!');

} catch (error) {
  console.error('❌ ERROR during build move:');
  console.error(error.message);
  console.error('💡 Check file permissions and disk space');
  process.exit(1);
} 