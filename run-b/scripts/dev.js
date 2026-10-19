const { execSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

console.log('[dev] Building main + preload...');
try {
  execSync('npx tsc -p tsconfig.node.json', { cwd: root, stdio: 'inherit' });
  execSync('npm run build:preload', { cwd: root, stdio: 'inherit' });
} catch {
  console.error('[dev] TypeScript compilation failed');
  process.exit(1);
}

console.log('[dev] Building renderer...');
try {
  execSync('npx vite build', { cwd: root, stdio: 'inherit' });
} catch {
  console.error('[dev] Vite build failed');
  process.exit(1);
}

console.log('[dev] Starting Electron...');
try {
  const electronEnv = { ...process.env };
  // Some automation shells set this globally, which makes Electron behave like plain Node.
  delete electronEnv.ELECTRON_RUN_AS_NODE;
  execSync('npx electron .', { cwd: root, stdio: 'inherit', env: electronEnv });
} catch (error) {
  if (error.status !== 0) {
    console.error('[dev] Electron exited with an error.');
    process.exitCode = error.status ?? 1;
  }
}
