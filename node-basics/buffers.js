// ==============================================================================
// StyleHub – Experiment 7: Node.js Buffers Demonstration
// Concept: Binary Data Manipulation in V8/Node.js memory outside V8 heap
// File: node-basics/buffers.js
// Execution: node node-basics/buffers.js
// ==============================================================================

import { Buffer } from 'buffer';

console.log("=================================================================");
console.log("  StyleHub Node.js Buffers Demonstration");
console.log("=================================================================\n");

// 1. Product data string representing a clothing order receipt
const productData = "StyleHub Apparel | Item: Classic Denim Jacket | Price: ₹2499 | Stock: 25";

console.log("Original String:");
console.log(`"${productData}"\n`);

// 2. Buffer.from(): Allocate raw memory containing binary encoding of the string
console.log("--- 1. Demonstrating Buffer.from() ---");
const productBuffer = Buffer.from(productData, 'utf-8');

console.log("Raw Binary Buffer Object (Hexadecimal representation in memory):");
console.log(productBuffer);
console.log(`Type: ${typeof productBuffer} | IsBuffer: ${Buffer.isBuffer(productBuffer)}\n`);

// 3. Buffer.length: Total bytes allocated in memory
console.log("--- 2. Demonstrating Buffer Length ---");
console.log(`String character count: ${productData.length} characters`);
console.log(`Buffer memory byte count: ${productBuffer.length} bytes`);
console.log("(Note: The Indian Rupee symbol '₹' takes 3 bytes in UTF-8, making byte length > character length)\n");

// 4. Buffer.toString(): Decode binary buffer back to human-readable string formats
console.log("--- 3. Demonstrating buffer.toString() in multiple encodings ---");

// A. UTF-8 (Default)
const utf8String = productBuffer.toString('utf-8');
console.log(`[UTF-8 Decoded String]:`);
console.log(`"${utf8String}"\n`);

// B. Base64 (Used in e-commerce for transmitting product images and authorization tokens)
const base64Encoded = productBuffer.toString('base64');
console.log(`[Base64 Encoded (for network payloads)]:`);
console.log(`${base64Encoded}\n`);

// C. Hexadecimal
const hexEncoded = productBuffer.toString('hex');
console.log(`[Hexadecimal String]:`);
console.log(`${hexEncoded.substring(0, 60)}... (truncated)\n`);

// 5. BONUS: Demonstrating Buffer.alloc() and Buffer.write()
console.log("--- 4. Demonstrating Buffer.alloc() and Buffer.write() ---");
const emptyBuffer = Buffer.alloc(30); // 30 bytes of zero-filled memory
emptyBuffer.write("StyleHub New Arrival");
console.log("Allocated & Written Buffer:");
console.log(emptyBuffer);
console.log(`Converted to string: "${emptyBuffer.toString('utf-8').trim()}"\n`);

console.log("Buffer demonstration completed successfully!");
