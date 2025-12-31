const mysql = require('mysql2/promise');

async function addResetPasswordFields() {
  try {
    console.log('Adding reset password fields to users table...');
    
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'root@20042713!',
      database: 'house_rental_db'
    });

    // Add reset_token and reset_expires columns
    await connection.execute(`
      ALTER TABLE users 
      ADD COLUMN reset_token VARCHAR(255) NULL,
      ADD COLUMN reset_expires DATETIME NULL,
      ADD COLUMN google_id VARCHAR(255) NULL
    `);

    console.log('✅ Reset password fields added successfully!');
    
    await connection.end();
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('✅ Reset password fields already exist!');
    } else {
      console.error('❌ Error adding reset password fields:', error.message);
    }
  }
}

addResetPasswordFields();