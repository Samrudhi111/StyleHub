// ==============================================================================
// StyleHub – Experiment 7: Node.js Streams Demonstration
// Concept: Continuous Chunk-by-Chunk Data Processing using EventEmitters
// File: node-basics/streams.js
// Execution: node node-basics/streams.js
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inventoryFilePath = path.join(__dirname, 'inventory.txt');

console.log("=================================================================");
console.log("  StyleHub Node.js Streams Demonstration");
console.log("=================================================================\n");

// Ensure inventory.txt exists before reading
if (!fs.existsSync(inventoryFilePath)) {
  fs.writeFileSync(
    inventoryFilePath,
    "STYLEHUB INVENTORY STREAM SOURCE\nItem: Classic Denim Jacket | Price: 2499\nItem: Floral Summer Dress | Price: 1899\nItem: Slim Fit Chinos | Price: 1599\n"
  );
}

console.log(`Target Stream Source: ${inventoryFilePath}\n`);

// 1. Create a Readable Stream with highWaterMark for demonstration
// highWaterMark: 64 limits buffer chunk size to 64 bytes to clearly show multiple chunks
const readableStream = fs.createReadStream(inventoryFilePath, {
  encoding: 'utf8',
  highWaterMark: 64 // 64-byte chunks to demonstrate streaming behavior
});

let chunkCount = 0;
let totalBytesRead = 0;
let aggregatedData = '';

console.log("Stream opened. Listening to Stream Events ('data', 'end', 'error')...\n");

// 2. 'data' EVENT: Fired every time a chunk of data is ready from the source
readableStream.on('data', (chunk) => {
  chunkCount++;
  totalBytesRead += Buffer.byteLength(chunk, 'utf8');

  console.log(`[Stream Event: 'data'] Received Chunk #${chunkCount} (${chunk.length} characters):`);
  console.log(`>>> "${chunk.replace(/\n/g, '\\n')}"`);
  console.log("----------------------------------------------------------------------");

  aggregatedData += chunk;
});

// 3. 'end' EVENT: Fired when there is no more data to read from the stream
readableStream.on('end', () => {
  console.log("\n[Stream Event: 'end'] Stream reading finished completely!");
  console.log("======================================================================");
  console.log("STREAMING SUMMARY:");
  console.log(`- Total Chunks Processed: ${chunkCount}`);
  console.log(`- Total Bytes Streamed:    ${totalBytesRead} bytes`);
  console.log("======================================================================");
  console.log("\nFull Aggregated Streamed Document Content:");
  console.log(aggregatedData);
  console.log("Readable Stream demonstration completed successfully!");
});

// 4. 'error' EVENT: Fired if an I/O error or permission issue occurs
readableStream.on('error', (err) => {
  console.error(`\x1b[31m[Stream Event: 'error'] Failure reading stream:\x1b[0m ${err.message}`);
});
