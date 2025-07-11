#!/usr/bin/env node

/**
 * Pre-commit Hook for ORBT Doctrine Compliance
 * 
 * This script runs automatically before git commits to ensure
 * ORBT compliance and Barton Doctrine enforcement.
 * 
 * Usage: node pre-commit.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 ORBT Pre-commit Validation Starting...');

try {
  // Run ORBT bootstrap to ensure manuals are present
  console.log('📋 Running ORBT bootstrap...');
  execSync('node orbt-bootstrap.js', { stdio: 'inherit' });
  
  // Run ORBT validation
  console.log('✅ Running ORBT validation...');
  execSync('node orbt-validate.js', { stdio: 'inherit' });
  
  // Check if validation passed
  const statusPath = path.join(process.cwd(), 'orbt', 'ORBT_STATUS.json');
  if (fs.existsSync(statusPath)) {
    const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
    
    if (status.status_flag === 'green' && status.orbt_compliance === true) {
      console.log('🎉 ORBT compliance achieved - commit allowed');
      process.exit(0);
    } else {
      console.log('❌ ORBT compliance failed - commit blocked');
      console.log('Please fix ORBT violations before committing');
      process.exit(1);
    }
  } else {
    console.log('⚠️  ORBT status file not found - running validation...');
    execSync('node orbt-validate.js', { stdio: 'inherit' });
  }
  
} catch (error) {
  console.error('❌ ORBT pre-commit validation failed:', error.message);
  console.log('Please fix ORBT violations before committing');
  process.exit(1);
} 