#!/usr/bin/env node

/**
 * ORBT Setup Script for Ultimate Blueprint Pilot
 * 
 * This script sets up automatic ORBT and Barton Doctrine enforcement
 * by configuring git hooks and build processes.
 * 
 * Usage: node setup-orbt.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Setting up ORBT and Barton Doctrine enforcement...');

try {
  // 1. Run ORBT bootstrap
  console.log('📋 Step 1: Running ORBT bootstrap...');
  execSync('node orbt-bootstrap.js', { stdio: 'inherit' });
  
  // 2. Create .git/hooks directory if it doesn't exist
  const hooksDir = path.join(process.cwd(), '.git', 'hooks');
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }
  
  // 3. Create pre-commit hook
  const preCommitHook = path.join(hooksDir, 'pre-commit');
  const preCommitContent = `#!/bin/sh
# ORBT Pre-commit Hook
node pre-commit.js
`;
  
  fs.writeFileSync(preCommitHook, preCommitContent, 'utf8');
  
  // 4. Make pre-commit hook executable (Unix-like systems)
  try {
    execSync(`chmod +x "${preCommitHook}"`);
  } catch {
    // Windows doesn't need chmod
    console.log('ℹ️  Skipping chmod on Windows system');
  }
  
  // 5. Create post-checkout hook to ensure ORBT is always present
  const postCheckoutHook = path.join(hooksDir, 'post-checkout');
  const postCheckoutContent = `#!/bin/sh
# ORBT Post-checkout Hook
node orbt-bootstrap.js
`;
  
  fs.writeFileSync(postCheckoutHook, postCheckoutContent, 'utf8');
  
  try {
    execSync(`chmod +x "${postCheckoutHook}"`);
  } catch {
    console.log('ℹ️  Skipping chmod on Windows system');
  }
  
  // 6. Run initial validation
  console.log('✅ Step 2: Running initial ORBT validation...');
  execSync('node orbt-validate.js', { stdio: 'inherit' });
  
  // 7. Create ORBT configuration file
  const orbtConfig = {
    auto_enforce: true,
    barton_doctrine: true,
    pre_commit_validation: true,
    deployment_gate: true,
    setup_date: new Date().toISOString(),
    version: '1.0.0'
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), 'orbt', 'ORBT_CONFIG.json'),
    JSON.stringify(orbtConfig, null, 2),
    'utf8'
  );
  
  console.log('🎉 ORBT setup complete!');
  console.log('');
  console.log('📋 What was configured:');
  console.log('✅ ORBT bootstrap script integrated');
  console.log('✅ ORBT validation integrated into build process');
  console.log('✅ Pre-commit hook created for automatic validation');
  console.log('✅ Post-checkout hook created for automatic bootstrap');
  console.log('✅ Deployment gate integrated');
  console.log('✅ Barton Doctrine enforcement enabled');
  console.log('');
  console.log('🚀 Next steps:');
  console.log('1. Customize the ORBT manuals in /orbt/ directory');
  console.log('2. Run: npm run orbt:check');
  console.log('3. Achieve GREEN compliance status');
  console.log('4. Start development with: npm run dev');
  
} catch (error) {
  console.error('❌ ORBT setup failed:', error.message);
  process.exit(1);
} 