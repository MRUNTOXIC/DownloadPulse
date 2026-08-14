const { spawn, execSync } = require('child_process');
const path = require('path');
const os = require('os');
const qrcode = require('qrcode-terminal');

function killStalePortProcesses() {
  const ports = [5001, 5002, 8081, 3000];
  ports.forEach(port => {
    try {
      if (process.platform === 'win32') {
        execSync(`for /f "tokens=5" %a in ('netstat -aon ^| findstr :${port}') do taskkill /f /pid %a`, { stdio: 'ignore' });
      } else {
        execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
      }
    } catch (e) {}
  });
}

killStalePortProcesses();

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIp();
const defaultExpoUrl = `exp://${localIp}:8081`;

const services = [
  {
    name: 'Backend API',
    cwd: path.join(__dirname, 'backend'),
    cmd: 'npm',
    args: ['start'],
    color: '\x1b[36m' // Cyan
  },
  {
    name: 'Desktop Agent',
    cwd: path.join(__dirname, 'desktop-agent'),
    cmd: 'npm',
    args: ['start'],
    color: '\x1b[32m' // Green
  },
  {
    name: 'Mobile App (Expo)',
    cwd: path.join(__dirname, 'mobile'),
    cmd: 'npx',
    args: ['expo', 'start'],
    color: '\x1b[35m' // Magenta
  },
  {
    name: 'Website Portal (Pulse)',
    cwd: path.join(__dirname, 'pulse'),
    cmd: 'npm',
    args: ['run', 'dev'],
    color: '\x1b[33m' // Yellow
  }
];

const resetColor = '\x1b[0m';

console.log(`\n=================================================`);
console.log(`   ⚡ DownloadPulse Master One-Go Launcher ⚡    `);
console.log(`=================================================`);
console.log(`Launching Backend API, Desktop Agent, Expo Mobile App, and 3D Website Portal (http://localhost:3000)...\n`);

function printExpoQrCode(url) {
  console.log(`\n\x1b[35m=================================================\x1b[0m`);
  console.log(`\x1b[35m  📱 SCAN QR CODE WITH EXPO GO (iOS / Android)  \x1b[0m`);
  console.log(`\x1b[35m=================================================\x1b[0m\n`);
  try {
    qrcode.generate(url, { small: true });
  } catch (e) {
    console.log(`(Failed to render QR visual: ${e.message})`);
  }
  console.log(`\n\x1b[36mExpo Go URL:\x1b[0m \x1b[1m\x1b[33m${url}\x1b[0m`);
  console.log(`\x1b[35m=================================================\x1b[0m`);
  console.log(`\x1b[36m  🚀 EMULATOR / SIMULATOR LAUNCH OPTIONS:\x1b[0m`);
  console.log(`  • Press \x1b[1m\x1b[33m[ i ]\x1b[0m in terminal -> Open in \x1b[1miOS Simulator\x1b[0m (macOS)`);
  console.log(`  • Press \x1b[1m\x1b[33m[ a ]\x1b[0m in terminal -> Open in \x1b[1mAndroid Emulator\x1b[0m`);
  console.log(`  • Press \x1b[1m\x1b[33m[ w ]\x1b[0m in terminal -> Open in \x1b[1mWeb Browser\x1b[0m`);
  console.log(`  • Dedicated terminal commands:`);
  console.log(`      \x1b[32mnpm run ios\x1b[0m      (Direct iOS Simulator)`);
  console.log(`      \x1b[32mnpm run android\x1b[0m  (Direct Android Emulator)`);
  console.log(`\x1b[35m=================================================\x1b[0m\n`);
}

// Print Expo QR Code upfront so user sees it right away when running start-all.sh
printExpoQrCode(defaultExpoUrl);

const isWin = process.platform === 'win32';
const children = [];
let expoChildProcess = null;

let printedCustomQr = false;

services.forEach(service => {
  const executable = isWin ? `${service.cmd}.cmd` : service.cmd;
  const nodeBinDir = path.dirname(process.execPath);
  const homeDir = process.env.HOME || '';
  const updatedPath = [
    `${homeDir}/.volta/bin`,
    `${homeDir}/Library/Android/sdk/emulator`,
    `${homeDir}/Library/Android/sdk/platform-tools`,
    nodeBinDir,
    process.env.PATH || '',
    '/opt/homebrew/bin',
    '/usr/local/bin',
    '/usr/bin',
    '/bin'
  ].filter(Boolean).join(':');

  const isExpoService = service.name === 'Mobile App (Expo)';

  const child = spawn(executable, service.args, {
    cwd: service.cwd,
    env: {
      ...process.env,
      PATH: updatedPath,
      ANDROID_HOME: `${homeDir}/Library/Android/sdk`,
      ANDROID_SDK_ROOT: `${homeDir}/Library/Android/sdk`,
      EXPO_PUBLIC_API_URL: `http://${localIp}:5001/api`
    },
    stdio: [isExpoService ? 'pipe' : 'ignore', 'pipe', 'pipe'],
    shell: isWin
  });

  if (isExpoService) {
    expoChildProcess = child;
  }

  children.push(child);

  child.on('error', (err) => {
    console.log(`${service.color}[${service.name}] Launcher Error:${resetColor} ${err.message}`);
  });

  child.stdout.on('data', (data) => {
    const text = data.toString();

    // Check if Expo printed a custom exp:// URL with a different IP/port
    if (service.name === 'Mobile App (Expo)' && !printedCustomQr) {
      const match = text.match(/exp:\/\/[^\s]+/);
      if (match && match[0] && match[0] !== defaultExpoUrl) {
        printedCustomQr = true;
        printExpoQrCode(match[0]);
      }
    }

    const lines = text.split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${service.color}[${service.name}]${resetColor} ${line}`);
      }
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${service.color}[${service.name}]${resetColor} ${line}`);
      }
    });
  });

  child.on('close', (code) => {
    console.log(`${service.color}[${service.name}]${resetColor} Exited with code ${code}`);
  });
});

// Enable interactive keypress forwarding for Expo CLI shortcuts (i: iOS, a: Android, w: Web)
if (process.stdin.isTTY) {
  try {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (key) => {
      if (key === '\u0003') { // Ctrl+C
        cleanup();
        return;
      }
      const char = key.toLowerCase();
      if ((char === 'i' || char === 'a' || char === 'w' || char === 'r') && expoChildProcess && expoChildProcess.stdin) {
        const actionLabel = char === 'i' ? 'iOS Simulator' : char === 'a' ? 'Android Emulator' : char === 'w' ? 'Web Browser' : 'Reloading Metro';
        console.log(`\n\x1b[35m[Mobile App (Expo)] Launching preview in ${actionLabel}...\x1b[0m`);
        expoChildProcess.stdin.write(key);
      }
    });
  } catch (e) {}
}

function cleanup() {
  console.log(`\n[DownloadPulse Launcher] Shutting down all services...`);
  children.forEach(child => {
    try {
      child.kill('SIGINT');
    } catch (e) {}
  });
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
