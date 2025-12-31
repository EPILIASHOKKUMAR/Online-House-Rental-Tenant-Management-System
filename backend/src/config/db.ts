import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Ashok@11042005',
  database: process.env.DB_NAME || 'house_rental',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(conn => {
    console.log('Database connected successfully!');
    conn.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
  });

export default pool;
