/**
 * Wrapper script for react-native CLI.
 * Ensures `run-windows` always includes required flags for consistent builds.
 * Splits build and deploy into two steps to ensure deploy always runs.
 *
 * Usage: yarn react-native run-windows
 * Step 1: react-native run-windows --no-deploy --no-launch --deploy-from-layout --arch x64 --logging
 * Step 2: react-native run-windows --no-build --deploy-from-layout --arch x64 --logging
 */
const {execFileSync} = require('child_process');
const path = require('path');

const args = process.argv.slice(2);

// On Windows, .bin shims are .cmd files
const ext = process.platform === 'win32' ? '.cmd' : '';
const reactNativeBin = path.resolve(
  __dirname,
  '..',
  'node_modules',
  '.bin',
  `react-native${ext}`,
);

function run(cmdArgs) {
  console.log(`\n>>> Running: react-native ${cmdArgs.join(' ')}\n`);
  execFileSync(reactNativeBin, cmdArgs, {stdio: 'inherit', cwd: process.cwd()});
}

if (args[0] === 'run-windows' && !args.includes('--help') && !args.includes('-h')) {
  // Collect any user-provided extra flags (skip 'run-windows' itself)
  const extraArgs = args.slice(1);

  const defaultFlags = [];
  if (!extraArgs.includes('--deploy-from-layout')) {
    defaultFlags.push('--deploy-from-layout');
  }
  if (!extraArgs.some(a => a.startsWith('--arch'))) {
    defaultFlags.push('--arch', 'x64');
  }
  if (!extraArgs.includes('--logging')) {
    defaultFlags.push('--logging');
  }

  // If user already passed --no-build or --no-deploy, just run as-is with defaults
  if (extraArgs.includes('--no-build') || extraArgs.includes('--no-deploy')) {
    try {
      run(['run-windows', ...extraArgs, ...defaultFlags]);
    } catch (e) {
      process.exit(e.status || 1);
    }
  } else {
    try {
      // Step 1: Build only (no deploy, no launch)
      console.log('\n========== STEP 1: BUILD ==========');
      run(['run-windows', '--no-deploy', '--no-launch', ...extraArgs, ...defaultFlags]);

      // Step 2: Deploy + Launch (no build)
      console.log('\n========== STEP 2: DEPLOY + LAUNCH ==========');
      run(['run-windows', '--no-build', ...extraArgs, ...defaultFlags]);
    } catch (e) {
      process.exit(e.status || 1);
    }
  }
} else {
  // Non-run-windows commands pass through unchanged
  try {
    run(args);
  } catch (e) {
    process.exit(e.status || 1);
  }
}
