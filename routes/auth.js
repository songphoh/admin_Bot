const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models/database');

// Route สำหรับล็อกอิน
router.post('/login', async (req, res) => {
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
});

module.exports = router;

// เพิ่มเมธอดลงทะเบียนในส่วนล่างของไฟล์เดิม
router.post('/register', async (req, res) => {
    const { username, platform_id, device_id } = req.body;

    try {
        // ตรวจสอบว่ามี platform_id ซ้ำหรือไม่
        const existingUser = await db.query(
            'SELECT * FROM bot_users WHERE platform_id = $1', 
            [platform_id]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Platform ID นี้ได้ถูกใช้งานแล้ว' });
        }

        // สร้างผู้ใช้ใหม่
        const newUser = await botUsersModel.createUser({
            username,
            platform_id,
            device_id
        });

        res.status(201).json({
            message: 'ลงทะเบียนสำเร็จ รอการอนุมัติ',
            user: {
                id: newUser.id,
                username: newUser.username,
                platform_id: newUser.platform_id,
                status: 'รออนุมัติ'
            }
        });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลงทะเบียน:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
    }
});

module.exports = router;