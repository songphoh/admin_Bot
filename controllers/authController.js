const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models/database');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // ค้นหาผู้ใช้ในฐานข้อมูล
        const userResult = await db.query(
            'SELECT * FROM users WHERE username = $1', 
            [username]
        );

        const user = userResult.rows[0];

        // ตรวจสอบผู้ใช้
        if (!user) {
            return res.status(401).json({ message: 'ไม่พบชื่อผู้ใช้' });
        }

        // ตรวจสอบรหัสผ่าน
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
        }

        // สร้าง Token
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // ส่งข้อมูลกลับ
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
    }
};