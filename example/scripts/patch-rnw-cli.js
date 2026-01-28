#!/usr/bin/env node
/**
 * Post-install script to patch react-native-windows CLI
 * to default to --no-deploy for this project (unpackaged app)
 */

const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const runWindowsOptionsPath = path.join(cwd, 'node_modules', '@react-native-windows', 'cli', 'lib-commonjs', 'commands', 'runWindows', 'runWindowsOptions.js');

if (!fs.existsSync(runWindowsOptionsPath)) {
  console.log('  react-native-windows CLI not found, skipping patch');
  process.exit(0);
}

let content = fs.readFileSync(runWindowsOptionsPath, 'utf8');

// Check if already patched
if (content.includes('// PATCHED: default --no-deploy')) {
  console.log('  react-native-windows CLI already patched');
  process.exit(0);
}

// Change --no-deploy to --deploy with default: false
// This makes deploy disabled by default
const oldPattern = `{
        name: '--no-deploy',
        description: 'Do not deploy the app',
    }`;
const newPattern = `{
        name: '--deploy',
        description: 'Deploy the app (disabled by default)', // PATCHED: default --no-deploy
        default: false,
    }`;

if (content.includes(oldPattern)) {
  content = content.replace(oldPattern, newPattern);
  fs.writeFileSync(runWindowsOptionsPath, content);
  console.log('✓ Patched react-native-windows CLI to default --no-deploy');
} else {
  console.log('  react-native-windows CLI pattern not found, may need manual update');
}
