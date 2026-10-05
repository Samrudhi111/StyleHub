// ==============================================================================
// StyleHub – Experiment 7: Node.js Event Loop Execution Order
// Concept: Call Stack, Microtask Queue (nextTick & Promise), Timers, Check Phase
// File: node-basics/event-loop.js
// Execution: node node-basics/event-loop.js
// ==============================================================================

import fs from 'fs';

console.log("=================================================================");
console.log("  StyleHub Node.js Event Loop Execution Demonstration");
console.log("=================================================================\n");

// ------------------------------------------------------------------------------
// 1. SYNCHRONOUS CODE (Runs immediately on the Call Stack - Phase 1)
// ------------------------------------------------------------------------------
console.log("1. [SYNCHRONOUS] Call Stack: StyleHub Inventory System Initializing...");

// ------------------------------------------------------------------------------
// 2. TIMERS PHASE: setTimeout (Macro-task queue)
// ------------------------------------------------------------------------------
setTimeout(() => {
  console.log("5. [MACROTASK: Timers] setTimeout(0ms): Checking Flash Sale Expiry timer.");
}, 0);

setTimeout(() => {
  console.log("7. [MACROTASK: Timers] setTimeout(50ms): Delayed Customer Follow-up Email.");
}, 50);

// ------------------------------------------------------------------------------
// 3. CHECK PHASE: setImmediate (Executes in Check phase of Event Loop)
// ------------------------------------------------------------------------------
setImmediate(() => {
  console.log("6. [MACROTASK: Check] setImmediate(): Updating Live Order Queue immediately after I/O.");
});

// ------------------------------------------------------------------------------
// 4. MICROTASKS: process.nextTick & Promise
// nextTick queue executes before the event loop continues, ahead of all other microtasks
// ------------------------------------------------------------------------------
process.nextTick(() => {
  console.log("3. [MICROTASK: nextTick] process.nextTick(): Critical Security Check (Highest Priority Microtask).");
});

Promise.resolve().then(() => {
  console.log("4. [MICROTASK: Promise] Promise.then(): Database Cart Query Resolved.");
});

// ------------------------------------------------------------------------------
// 5. SYNCHRONOUS CODE (End of synchronous block)
// ------------------------------------------------------------------------------
console.log("2. [SYNCHRONOUS] Call Stack: Initialization script finished executing.\n");

console.log("--- Waiting for Event Loop to drain microtask and macrotask queues ---\n");
