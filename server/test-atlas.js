import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load server environment variables
dotenv.config();

// ==============================================================================
// MongoDB Atlas Connection & Diagnostic Test Script (Experiment 10)
// Usage:
//   1. With .env: node test-atlas.js
//   2. With direct URI: node test-atlas.js "mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/stylehub?retryWrites=true&w=majority"
// ==============================================================================

const targetUri = process.argv[2] || process.env.MONGODB_URI || process.env.MONGO_URI;

console.log('\n=============================================================');
console.log('   StyleHub MongoDB Atlas Cloud Connection Diagnostic Test   ');
console.log('=============================================================');

if (!targetUri) {
  console.error('\x1b[31m[Error]\x1b[0m No MongoDB connection URI specified.');
  console.log('Please provide a URI in server/.env (as MONGODB_URI) or pass it as an argument:');
  console.log('node test-atlas.js "mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/stylehub"');
  process.exit(1);
}

// Mask password for safe display in console/terminal
const maskedUri = targetUri.replace(/:([^:@]+)@/, ':********@');
console.log(`\nConnecting to: \x1b[36m${maskedUri}\x1b[0m\n`);

async function runDiagnostic() {
  const startTime = Date.now();

  try {
    console.log('[1/4] Initiating TLS handshake & connecting to cluster...');
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 10000 // 10-second timeout for cloud networks
    });

    const latency = Date.now() - startTime;
    console.log(`\x1b[32m✓ [1/4] Connected Successfully!\x1b[0m (Latency: ${latency}ms)`);
    console.log(`       Cluster Host: ${conn.connection.host}`);
    console.log(`       Database Name: ${conn.connection.name}`);
    console.log(`       Connection State: ${conn.connection.readyState === 1 ? 'Connected (1)' : 'Other'}`);

    console.log('\n[2/4] Testing database ping...');
    const adminDb = conn.connection.db.admin();
    const pingResult = await adminDb.ping();
    console.log(`\x1b[32m✓ [2/4] Database Ping Acknowledged:\x1b[0m`, pingResult);

    console.log('\n[3/4] Testing write & read operations on "stylehub.diagnostics" collection...');
    const DiagnosticModel = mongoose.model(
      'DiagnosticCheck',
      new mongoose.Schema({ timestamp: Date, testNote: String }, { timestamps: true })
    );

    const testDoc = await DiagnosticModel.create({
      timestamp: new Date(),
      testNote: 'Experiment 10 Cloud Deployment Readiness Test'
    });
    console.log(`\x1b[32m✓ [3/4] Write verified:\x1b[0m Created document ID: ${testDoc._id}`);

    const readDoc = await DiagnosticModel.findById(testDoc._id);
    console.log(`\x1b[32m✓ [3/4] Read verified:\x1b[0m Retrieved document with note: "${readDoc.testNote}"`);

    // Clean up test document
    await DiagnosticModel.findByIdAndDelete(testDoc._id);
    console.log(`\x1b[32m✓ [3/4] Cleanup verified:\x1b[0m Test document removed.`);

    console.log('\n[4/4] Listing existing collections in database...');
    const collections = await conn.connection.db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);
    console.log(`       Collections found (${collectionNames.length}):`, collectionNames.join(', ') || '(Empty database - ready for StyleHub)');

    console.log('\n=============================================================');
    console.log('\x1b[32m%s\x1b[0m', '  ALL ATLAS DIAGNOSTIC TESTS PASSED! READY FOR RENDER & VERCEL  ');
    console.log('=============================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n\x1b[31m=============================================================');
    console.error(`  CONNECTION FAILED: ${error.name}`);
    console.error('=============================================================\x1b[0m');
    console.error(`\x1b[33mError Message:\x1b[0m ${error.message}\n`);

    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.log('\x1b[36m[Troubleshooting Tip - Authentication]\x1b[0m');
      console.log('1. Verify your Database User credentials in MongoDB Atlas: Database Access tab.');
      console.log('2. Ensure the username and password match.');
      console.log('3. If password contains special characters (like @, #, %), URL-encode them or use an alphanumeric password.');
    } else if (error.message.includes('timed out') || error.message.includes('Server selection timed out')) {
      console.log('\x1b[36m[Troubleshooting Tip - Network Whitelist]\x1b[0m');
      console.log('1. Go to MongoDB Atlas -> Network Access tab.');
      console.log('2. Click "Add IP Address" -> Select "Allow Access from Anywhere" (0.0.0.0/0).');
      console.log('3. Wait 1-2 minutes for the changes to apply on Atlas.');
    }

    process.exit(1);
  }
}

runDiagnostic();
