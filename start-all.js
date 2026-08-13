const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const qrcode = require('qrcode-terminal');

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
    name: 'Website Portal',
    cwd: path.join(__dirname, 'website'),
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
  console.log(`\x1b[35m=================================================\x1b[0m\n`);
}

// Print Expo QR Code upfront so user sees it right away when running start-all.sh
printExpoQrCode(defaultExpoUrl);

const isWin = process.platform === 'win32';
const children = [];

let printedCustomQr = false;

services.forEach(service => {
  const executable = isWin ? `${service.cmd}.cmd` : service.cmd;

  const child = spawn(executable, service.args, {
    cwd: service.cwd,
    env: { ...process.env, EXPO_PUBLIC_API_URL: `http://${localIp}:5001/api` },
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
  });

  children.push(child);

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
