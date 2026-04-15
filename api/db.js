import mysql from 'mysql2/promise';

export const dbConfig = {
  uri: process.env.DATABASE_URL
};

export async function getConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL environment variable");
  }
  return await mysql.createConnection(process.env.DATABASE_URL);
}
