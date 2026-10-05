// ==============================================================================
// StyleHub – Experiment 7: Node.js File System Module (fs)
// Concept: Synchronous and Asynchronous File I/O Operations
// File: node-basics/filesystem.js
// Execution: node node-basics/filesystem.js
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inventoryFilePath = path.join(__dirname, 'inventory.txt');

console.log("=================================================================");
console.log("  StyleHub File System (fs) Demonstration");
console.log("=================================================================\n");

// 1. Initial Product Data to Write
const initialInventory = 
`STYLEHUB WAREHOUSE INVENTORY RECORD
Generated: ${new Date().toLocaleString()}
----------------------------------------------------------------------
[ID: 101] Classic Denim Jacket      | Category: Men   | Qty: 25 | Price: ₹2499
[ID: 102] Floral Summer Dress       | Category: Women | Qty: 18 | Price: ₹1899
[ID: 103] Slim Fit Chinos           | Category: Men   | Qty: 30 | Price: ₹1599
`;

// 2. WRITE OPERATION: Create inventory.txt and write product information
console.log("Step 1: Writing initial product catalog to 'inventory.txt'...");
fs.writeFileSync(inventoryFilePath, initialInventory, 'utf8');
console.log("✓ File created and written successfully!\n");

// 3. READ OPERATION: Read and display file contents
console.log("Step 2: Reading 'inventory.txt' contents from disk:");
console.log("----------------------------------------------------------------------");
const readContent = fs.readFileSync(inventoryFilePath, 'utf8');
console.log(readContent);
console.log("----------------------------------------------------------------------\n");

// 4. APPEND OPERATION: Append new arrival products to the inventory
const newArrivals = 
`[ID: 104] Oversized Cotton Hoodie   | Category: Men   | Qty: 15 | Price: ₹1999
[ID: 105] Italian Leather Belt      | Category: Access| Qty: 50 | Price: ₹1299
----------------------------------------------------------------------
Total Items Tracked: 5 Products
`;

console.log("Step 3: Appending new arrival products to 'inventory.txt'...");
fs.appendFileSync(inventoryFilePath, newArrivals, 'utf8');
console.log("✓ New product information appended successfully!\n");

// 5. VERIFY FINAL CONTENT: Read again to verify appended records
console.log("Step 4: Reading updated 'inventory.txt' after append operation:");
console.log("======================================================================");
const finalContent = fs.readFileSync(inventoryFilePath, 'utf8');
console.log(finalContent);
console.log("======================================================================");

// Display File Metadata (Stats)
const stats = fs.statSync(inventoryFilePath);
console.log("\nInventory File Stats:");
console.log(`- File Path:  ${inventoryFilePath}`);
console.log(`- File Size:  ${stats.size} bytes`);
console.log(`- Created At: ${stats.birthtime.toLocaleTimeString()}`);
console.log(`- Last Mod:   ${stats.mtime.toLocaleTimeString()}`);
console.log("\nFile System demonstration completed successfully!");
