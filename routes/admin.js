const express = require('express');
const router = express.Router();
const botUsersModel = require('../models/bot_users');
const jwt = require('jsonwebtoken');

// Middleware ตรวจสอบ Token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// ดึงสถิติผู้ใช้
router.get('/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const stats = await botUsersModel.getBotUserStats();
        res.json(stats);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงสถิติ:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงสถิติ' });
    }
});

// ดึงรายการผู้ใช้ที่รออนุมัติ
router.get('/pending-users', authenticateToken, async (req, res) => {
    try {
        const pendingUsers = await botUsersModel.getPendingUsers();
        res.json(pendingUsers);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงผู้ใช้รออนุมัติ:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงผู้ใช้รออนุมัติ' });
    }
});

// อนุมัติผู้ใช้
router.post('/approve-user/:userId', authenticateToken, async (req, res) => {
    const { userId } = req.params;
    
    try {
        const approvedUser = await botUsersModel.approveUser(userId);
        res.json(approvedUser);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอนุมัติผู้ใช้:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอนุมัติผู้ใช้' });
    }
});

// ระงับการใช้งานผู้ใช้
router.post('/deactivate-user/:userId', authenticateToken, async (req, res) => {
    const { userId } = req.params;
    
    try {
        const deactivatedUser = await botUsersModel.deactivateUser(userId);
        res.json(deactivatedUser);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการระงับผู้ใช้:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการระงับผู้ใช้' });
    }
});

module.exports = router;