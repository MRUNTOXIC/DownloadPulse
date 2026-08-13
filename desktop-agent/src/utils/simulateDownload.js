const fs = require('fs');
const path = require('path');
const config = require('../config/config');

/**
 * Download Simulation Script for Development / Testing
 * 
 * Simulates a file being downloaded into the target Downloads folder
 * by gradually appending data to increase file size over time.
 */
function runSimulation() {
  const targetDir = config.downloadsDir;

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Use Spiderman.mp4 or test-download.bin
  const fileName = process.argv[2] || 'Spiderman.mp4';
  const filePath = path.join(targetDir, fileName);

  console.log(`[Simulate Download] Creating simulated download file at:`);
  console.log(`${filePath}\n`);

  // Remove pre-existing file if present
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Chunk size ~ 600 KB per step to simulate realistic incremental download
  const chunkSize = 600 * 1024;
  const chunkBuffer = Buffer.alloc(chunkSize, 'A');

  // Step 1: Write initial chunk (1.2 MB)
  fs.writeFileSync(filePath, Buffer.concat([chunkBuffer, chunkBuffer]));
  console.log(`[Simulate Download] Step 1: Written initial chunk (~1.2 MB)`);

  // Step 2: Append chunk after 1.5 seconds (1.8 MB)
  setTimeout(() => {
    fs.appendFileSync(filePath, chunkBuffer);
    console.log(`[Simulate Download] Step 2: Appended chunk (~1.8 MB)`);

    // Step 3: Append chunk after another 1.5 seconds (2.4 MB)
    setTimeout(() => {
      fs.appendFileSync(filePath, chunkBuffer);
      console.log(`[Simulate Download] Step 3: Appended final chunk (~2.4 MB) - Download finished writing!`);
      console.log(`[Simulate Download] Waiting for watcher to detect stability...\n`);
    }, 1500);
  }, 1500);
}

runSimulation();
