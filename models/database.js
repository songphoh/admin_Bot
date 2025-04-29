const { Pool } = require('pg');
require('dotenv').config();

// สร้างการเชื่อมต่อกับ PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { 
    rejectUnauthorized: false,  // สำคัญสำหรับ Render
    // เพิ่มการตั้งค่า SSL เพิ่มเติม
    sslmode: 'require'
  } : false
});

// ทดสอบการเชื่อมต่อ
pool.connect()
  .then(() => console.log('เชื่อมต่อกับฐานข้อมูล PostgreSQL สำเร็จ'))
  .catch(err => console.error('ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้:', err));

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect()
};