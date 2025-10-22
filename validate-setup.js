#!/usr/bin/env node

/**
 * Validation script to check if the Firebase backend setup is correct
 */

import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

const checks = [];
let passed = 0;
let failed = 0;

function check(name, condition, errorMessage) {
  if (condition) {
    console.log(`✓ ${name}`);
    passed++;
  } else {
    console.log(`✗ ${name}`);
    if (errorMessage) console.log(`  ${errorMessage}`);
    failed++;
  }
  checks.push({ name, passed: condition });
}

console.log('Validating Firebase Backend Setup...\n');

// Check files exist
check(
  'package.json exists',
  existsSync('./package.json'),
  'Run: npm init to create package.json'
);

check(
  'server.js exists',
  existsSync('./server.js'),
  'server.js is missing'
);

check(
  'firebase.json exists',
  existsSync('./firebase.json'),
  'Run: firebase init to create firebase.json'
);

check(
  'functions/package.json exists',
  existsSync('./functions/package.json'),
  'functions/package.json is missing'
);

check(
  'functions/index.js exists',
  existsSync('./functions/index.js'),
  'functions/index.js is missing'
);

check(
  'node_modules exists',
  existsSync('./node_modules'),
  'Run: npm install'
);

check(
  'functions/node_modules exists',
  existsSync('./functions/node_modules'),
  'Run: cd functions && npm install'
);

check(
  '.gitignore exists',
  existsSync('./.gitignore'),
  '.gitignore is missing - node_modules will be committed!'
);

// Check package.json configuration
try {
  const pkg = JSON.parse(await readFile('./package.json', 'utf8'));
  
  check(
    'package.json has "type": "module"',
    pkg.type === 'module',
    'Add "type": "module" to package.json'
  );
  
  check(
    'package.json has express dependency',
    pkg.dependencies && pkg.dependencies.express,
    'Run: npm install express'
  );
  
  check(
    'package.json has start script',
    pkg.scripts && pkg.scripts.start,
    'Add "start" script to package.json'
  );
} catch (e) {
  check('package.json is valid JSON', false, e.message);
}

// Check functions package.json
try {
  const funcPkg = JSON.parse(await readFile('./functions/package.json', 'utf8'));
  
  check(
    'functions/package.json has "type": "module"',
    funcPkg.type === 'module',
    'Add "type": "module" to functions/package.json'
  );
  
  check(
    'functions has firebase-functions dependency',
    funcPkg.dependencies && funcPkg.dependencies['firebase-functions'],
    'Run: cd functions && npm install firebase-functions'
  );
  
  check(
    'functions has express dependency',
    funcPkg.dependencies && funcPkg.dependencies.express,
    'Run: cd functions && npm install express'
  );
} catch (e) {
  check('functions/package.json is valid JSON', false, e.message);
}

// Check firebase.json configuration
try {
  const firebaseConfig = JSON.parse(await readFile('./firebase.json', 'utf8'));
  
  check(
    'firebase.json has hosting configuration',
    firebaseConfig.hosting !== undefined,
    'Add hosting configuration to firebase.json'
  );
  
  check(
    'firebase.json has functions configuration',
    firebaseConfig.functions !== undefined,
    'Add functions configuration to firebase.json'
  );
  
  if (firebaseConfig.hosting && firebaseConfig.hosting.rewrites) {
    check(
      'firebase.json has API rewrite rules',
      firebaseConfig.hosting.rewrites.length > 0,
      'Add rewrite rules for /api/** to functions'
    );
  }
} catch (e) {
  check('firebase.json is valid JSON', false, e.message);
}

// Check module loading
try {
  const serverModule = await import('./server.js');
  check('server.js loads without errors', true);
} catch (e) {
  check('server.js loads without errors', false, e.message);
}

try {
  const functionsModule = await import('./functions/index.js');
  check(
    'functions/index.js exports "api"',
    functionsModule.api !== undefined,
    'Export "api" function from functions/index.js'
  );
} catch (e) {
  check('functions/index.js loads without errors', false, e.message);
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Summary: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed === 0) {
  console.log('\n✅ All checks passed! Your Firebase backend is ready for deployment.');
  console.log('\nNext steps:');
  console.log('1. Run: firebase login');
  console.log('2. Run: firebase use --add');
  console.log('3. Run: firebase deploy');
  console.log('\nSee DEPLOYMENT.md for detailed deployment instructions.');
  process.exit(0);
} else {
  console.log('\n❌ Some checks failed. Please fix the issues above before deploying.');
  process.exit(1);
}
