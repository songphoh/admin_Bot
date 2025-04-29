const db = require('./database');

const botUsersModel = {
    // เพิ่มเมธอดสำหรับจัดการผู้ใช้
    createUser: async (userData) => {
        const { 
            username, 
            platform_id, 
            device_id = null 
        } = userData;
        
        try {
            const result = await db.query(`
                INSERT INTO bot_users (
                    username, 
                    platform_id, 
                    device_id,
                    is_active,
                    online_status
                ) 
                VALUES ($1, $2, $3, false, false) 
                RETURNING *
            `, [
                username, 
                platform_id, 
                device_id
            ]);
            
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    // ดึงผู้ใช้ที่รออนุมัติ
    getPendingUsers: async () => {
        try {
            const result = await db.query(`
                SELECT * FROM bot_users 
                WHERE is_active = false 
                ORDER BY registration_date DESC
            `);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    // อนุมัติผู้ใช้
    approveUser: async (userId) => {
        try {
            const result = await db.query(`
                UPDATE bot_users 
                SET is_active = true, 
                    last_active = CURRENT_TIMESTAMP 
                WHERE id = $1 
                RETURNING *
            `, [userId]);
            
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    // ระงับการใช้งานผู้ใช้
    deactivateUser: async (userId) => {
        try {
            const result = await db.query(`
                UPDATE bot_users 
                SET is_active = false, 
                    last_active = CURRENT_TIMESTAMP 
                WHERE id = $1 
                RETURNING *
            `, [userId]);
            
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    // ดึงข้อมูลสถิติผู้ใช้
    getBotUserStats: async () => {
        try {
            const totalUsers = await db.query('SELECT COUNT(*) FROM bot_users');
            const pendingUsers = await db.query('SELECT COUNT(*) FROM bot_users WHERE is_active = false');
            const activeUsers = await db.query('SELECT COUNT(*) FROM bot_users WHERE is_active = true');
            
            return {
                total_users: parseInt(totalUsers.rows[0].count),
                pending_users: parseInt(pendingUsers.rows[0].count),
                active_users: parseInt(activeUsers.rows[0].count)
            };
        } catch (error) {
            throw error;
        }
    }
};

module.exports = botUsersModel;