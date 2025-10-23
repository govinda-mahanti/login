import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const promisePool = pool.promise();

const testConnection = async () => {
  try {
    const [rows] = await promisePool.query("SELECT NOW()");
    console.log("Database connected:", rows[0]["NOW()"]);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

testConnection();

export default promisePool;
