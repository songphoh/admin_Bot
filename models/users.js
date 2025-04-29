const db = require('./database');
const bcrypt = require('bcrypt');

const usersModel = {
    // ... โค้ดเดิม

    // เมธอดสำหรับสร้างผู้ใช้เริ่มต้น
    initializeAdminUser: async () => {
        try {
            // ตรวจสอบว่ามีผู้ใช้แอดมินหรือยัง
            const existingAdmin = await db.query(
                'SELECT * FROM users WHERE username = $1', 
                ['admin']
            );

            if (existingAdmin.rows.length === 0) {
                // สร้างรหัสผ่านแบบแฮช
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('admin123', salt);

                // สร้างผู้ใช้แอดมินเริ่มต้น
                await db.query(
                    'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
                    ['admin', hashedPassword, 'admin']
                );

                console.log('สร้างผู้ใช้แอดมินเริ่มต้นสำเร็จ');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการสร้างผู้ใช้แอดมิน:', error);
        }
    }
};

module.exports = usersModel;