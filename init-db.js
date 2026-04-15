import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDB() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error("❌ ERROR: Please set DATABASE_URL in your .env file or terminal.");
    console.error("Example: set DATABASE_URL=mysql://root:password@host:port/database");
    process.exit(1);
  }

  console.log("⏳ Connecting to MySQL on Railway...");

  let connection;
  try {
    connection = await mysql.createConnection(dbUrl);
    console.log("✅ Connected successfully!");

    console.log("⏳ Reading schema.sql...");
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');

    // Split queries by semicolon and run them one by one
    const queries = schema.split(';').map(q => q.trim()).filter(q => q.length > 0);

    console.log(`⏳ Executing ${queries.length} queries...`);
    
    for (const query of queries) {
        await connection.query(query);
    }

    console.log("✅ Database tables created successfully!");

  } catch (error) {
    console.error("❌ ERROR:", error.message);
  } finally {
    if (connection) {
       await connection.end();
    }
  }
}

initDB();
