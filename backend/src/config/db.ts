import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.join(__dirname, '../../.env') });

console.log('🔍 Environment Variables Debug:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'undefined');
console.log('DB_NAME:', process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root@20042713!',
  database: process.env.DB_NAME || 'house_rental_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined
});

pool.getConnection()
  .then(conn => {
    console.log('✅ Database connected successfully!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

export default pool;
