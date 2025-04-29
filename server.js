const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./models/database');
const usersModel = require('./models/users');

// โหลด Environment variables
dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes สำหรับ API
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);

// Routes สำหรับ HTML - เพิ่มเส้นทางนี้
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

// จัดการ Error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('เกิดข้อผิดพลาดบางอย่าง!');
});

// เริ่มเซิร์ฟเวอร์
const startServer = async () => {
    try {
        // สร้างตาราง
        await createTables();

        // เริ่มฟังที่พอร์ต
        app.listen(PORT, () => {
            console.log(`เซิร์ฟเวอร์กำลังทำงานที่พอร์ต ${PORT}`);
            console.log(`เข้าสู่ระบบด้วย username: admin, password: admin123`);
        });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการเริ่มเซิร์ฟเวอร์:', error);
        process.exit(1);
    }
};

// ฟังก์ชันสร้างตาราง
async function createTables() {
    try {
        // สร้างตาราง users
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL DEFAULT 'admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // สร้างตาราง bot_users
        await db.query(`
            CREATE TABLE IF NOT EXISTS bot_users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                platform_id VARCHAR(100) UNIQUE NOT NULL,
                is_active BOOLEAN DEFAULT false,
                is_premium BOOLEAN DEFAULT false,
                online_status BOOLEAN DEFAULT false,
                registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_active TIMESTAMP
            )
        `);

        // สร้างผู้ใช้แอดมินเริ่มต้น
        await usersModel.initializeAdminUser();

        console.log('สร้างตารางและผู้ใช้เริ่มต้นสำเร็จ');
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการสร้างตาราง:', error);
        throw error;
    }
}

// เพิ่มโค้ดนี้ใน server.js
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

startServer();