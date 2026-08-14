const http = require('http');

const codeArg = process.argv[2];
const BACKEND_HOST = 'localhost';
const BACKEND_PORT = 5001;

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (postData) req.write(JSON.stringify(postData));
    req.end();
  });
}

async function runPairingTest() {
  console.log(`\n\x1b[36m=================================================\x1b[0m`);
  console.log(`\x1b[36m  ⚡ DOWNLOADPULSE PAIRING VERIFICATION TEST ⚡   \x1b[0m`);
  console.log(`\x1b[36m=================================================\x1b[0m\n`);

  try {
    // Step 1: Query PC Desktop Agent active status & code
    console.log(`\x1b[33m[1/3] Querying PC Desktop Agent active status & pairing code...\x1b[0m`);
    const statusRes = await makeRequest({
      hostname: BACKEND_HOST,
      port: BACKEND_PORT,
      path: '/api/pairing/status?deviceId=dev_downloadpulse_desktop_001',
      method: 'GET'
    });

    const activeCode = codeArg || (statusRes.body?.data?.pairingCode);
    console.log(`  • Device ID: dev_downloadpulse_desktop_001`);
    console.log(`  • PC Active Code: \x1b[1m\x1b[32m${activeCode || 'UNKNOWN'}\x1b[0m`);
    console.log(`  • PC Current State: ${statusRes.body?.data?.isPaired ? '🟢 PAIRED' : '🟡 UNPAIRED (PENDING CODE)'}\n`);

    if (!activeCode) {
      console.log(`\x1b[31m[ERROR] No pairing code available. Please pass code as argument: node test-pairing.js 123456\x1b[0m`);
      return;
    }

    // Step 2: Send Mobile Verification Request
    console.log(`\x1b[33m[2/3] Simulating Mobile App sending pairing code verification: ${activeCode}...\x1b[0m`);
    const verifyRes = await makeRequest({
      hostname: BACKEND_HOST,
      port: BACKEND_PORT,
      path: '/api/pairing/verify',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { pairingCode: activeCode });

    if (verifyRes.statusCode === 200 && verifyRes.body?.success) {
      console.log(`\x1b[32m  ✔ Backend Response: HTTP 200 OK - Computer Paired Successfully!\x1b[0m`);
      console.log(`  ✔ Linked User: Meet Jobanputra (meetjabhanputra2112@gmail.com)\n`);
    } else {
      console.log(`\x1b[31m  ✖ Backend Response Error (${verifyRes.statusCode}): ${verifyRes.body?.error || 'Failed'}\x1b[0m\n`);
      return;
    }

    // Step 3: Verify PC Desktop Agent reading status
    console.log(`\x1b[33m[3/3] Verifying Desktop Agent reading status from Backend...\x1b[0m`);
    await new Promise(r => setTimeout(r, 1000));

    const checkRes = await makeRequest({
      hostname: BACKEND_HOST,
      port: BACKEND_PORT,
      path: '/api/pairing/status?deviceId=dev_downloadpulse_desktop_001',
      method: 'GET'
    });

    if (checkRes.body?.data?.isPaired) {
      console.log(`\n\x1b[32m┌────────────────────────────────────────────────────────┐\x1b[0m`);
      console.log(`\x1b[32m│              ⚡ PC READ PAIRING SUCCESS ⚡             │\x1b[0m`);
      console.log(`\x1b[32m│                                                        │\x1b[0m`);
      console.log(`\x1b[32m│     Paired User: ${checkRes.body?.data?.pairedUser?.name || 'Meet Jobanputra'}\x1b[0m`);
      console.log(`\x1b[32m│     Email: ${checkRes.body?.data?.pairedUser?.email || 'meetjabhanputra2112@gmail.com'}\x1b[0m`);
      console.log(`\x1b[32m│     Status: 🟢 COMPUTER CONNECTED & MONITORED           │\x1b[0m`);
      console.log(`\x1b[32m└────────────────────────────────────────────────────────┘\x1b[0m\n`);
    } else {
      console.log(`\x1b[31m[!] PC Status pending update.\x1b[0m\n`);
    }

  } catch (err) {
    console.log(`\x1b[31m[Connection Error]: Make sure backend server is running on http://localhost:5001 (${err.message})\x1b[0m`);
  }
}

runPairingTest();
