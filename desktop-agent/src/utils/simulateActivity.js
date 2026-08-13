const fs = require('fs');
const path = require('path');
const config = require('../config/config');

/**
 * DownloadPulse Multi-Scenario File Activity Simulator
 * 
 * Tests detection, state transitions (STARTED, IN_PROGRESS, STALLED, COMPLETED, FAILED),
 * and notification emission across different activity types (DOWNLOAD, FILE_COPY).
 */
async function runSimulations() {
  const targetDir = config.downloadsDir;
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const scenario = process.argv[2] || 'all';

  console.log(`\n========================================`);
  console.log(`  DownloadPulse Activity Simulator      `);
  console.log(`========================================`);
  console.log(`Target directory: ${targetDir}`);
  console.log(`Running scenario: ${scenario}\n`);

  const chunkSize = 500 * 1024;
  const chunk = Buffer.alloc(chunkSize, 'B');

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  if (scenario === 'all' || scenario === 'download') {
    console.log(`--- Scenario 1: Standard File Download (Spiderman.mp4) ---`);
    const file = path.join(targetDir, 'Spiderman.mp4');
    if (fs.existsSync(file)) fs.unlinkSync(file);

    fs.writeFileSync(file, chunk);
    console.log(`Step 1: File created (500 KB)`);
    await sleep(1200);

    fs.appendFileSync(file, chunk);
    console.log(`Step 2: Size increased (1.0 MB)`);
    await sleep(1200);

    fs.appendFileSync(file, chunk);
    console.log(`Step 3: Size increased (1.5 MB) - Finished writing.`);
    await sleep(3500);
  }

  if (scenario === 'all' || scenario === 'copy') {
    console.log(`\n--- Scenario 2: USB / Pendrive File Copy (project.zip) ---`);
    const file = path.join(targetDir, 'project.zip');
    if (fs.existsSync(file)) fs.unlinkSync(file);

    fs.writeFileSync(file, chunk);
    console.log(`Step 1: Copy started from USB Drive E: to PC Downloads (500 KB)`);
    await sleep(1200);

    fs.appendFileSync(file, Buffer.concat([chunk, chunk]));
    console.log(`Step 2: Copy progress (1.5 MB)`);
    await sleep(1200);

    fs.appendFileSync(file, chunk);
    console.log(`Step 3: Copy finished (2.0 MB)`);
    await sleep(3500);
  }

  if (scenario === 'all' || scenario === 'fail') {
    console.log(`\n--- Scenario 3: Interrupted / Cancelled Download (corrupted_file.zip) ---`);
    const file = path.join(targetDir, 'corrupted_file.zip');
    if (fs.existsSync(file)) fs.unlinkSync(file);

    fs.writeFileSync(file, chunk);
    console.log(`Step 1: Download started (500 KB)`);
    await sleep(1200);

    fs.unlinkSync(file);
    console.log(`Step 2: Download cancelled / temp file deleted by user!`);
    await sleep(2500);
  }

  console.log(`\n========================================`);
  console.log(`  All Test Simulations Completed        `);
  console.log(`========================================\n`);
}

runSimulations().catch(console.error);
