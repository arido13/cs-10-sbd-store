const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  const dbName = process.env.DB_NAME || 'sbd_store_completed';
  const client = new Client({
    connectionString: process.env.DATABASE_URL || undefined,
    user: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
    host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
    database: process.env.DATABASE_URL ? undefined : 'postgres',
    password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
    port: process.env.DATABASE_URL ? undefined : process.env.DB_PORT,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL (postgres database)');
    
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
    if (res.rows.length === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
}

createDatabase();