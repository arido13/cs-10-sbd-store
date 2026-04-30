const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL || undefined,
  user: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
  database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
  port: process.env.DATABASE_URL ? undefined : process.env.DB_PORT,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

async function runSeed() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
    
    const seedPath = path.join(__dirname, 'seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    await client.query(seedSQL);
    console.log('Seed script executed successfully');
  } catch (err) {
    console.error('Error running seed:', err);
  } finally {
    await client.end();
  }
}

runSeed();