import mysql from "mysql2/promise";
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
};

// const pool = mysql.createPool(dbConfig);
export const pool = mysql.createPool(dbConfig);
export async function query({ query, values = [] }) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(query, values);
    return results;
  } catch (error) {
    return { error };
  } finally {
    if (connection) {
      connection.release();
    }
  }
}