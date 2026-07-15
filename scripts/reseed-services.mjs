import { MongoClient } from 'mongodb';
import fs from 'fs';

// load .env
const env = fs.readFileSync(new URL('../.env', import.meta.url), 'utf-8');
for (const line of env.split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2];
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'tectoflow';

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);
const res = await db.collection('services').deleteMany({});
console.log(`Dropped ${res.deletedCount} services docs. Next page load reseeds all 12 from lib/services.ts.`);
await client.close();
