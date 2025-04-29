// ตรวจสอบการเข้าสู่ระบบ
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    // แสดงชื่อผู้ใช้
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    document.getElementById('username').textContent = user.username || 'แอดมิน';
}

// โหลดข้อมูลสถิติ
async function loadDashboardStats() {
    try {
        const response = await fetch('/api/dashboard/stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        if (!response.ok) throw new Error('ไม่สามารถโหลดข้อมูลได้');

        const stats = await response.json();
        
        document.getElementById('total-users').textContent = stats.total_users;
        document.getElementById('online-users').textContent = stats.online_users;
        document.getElementById('premium-users').textContent = stats.premium_users;
    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
    }
}

// ออกจากระบบ
document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/login'; 
});

// เรียกใช้งานเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadDashboardStats();
});

// โหลดรายการผู้ใช้รออนุมัติ
async function loadPendingUsers() {
    try {
        const response = await fetchWithAuth('/api/admin/pending-users');
        const pendingUsers = await response.json();
        
        const pendingUsersList = document.getElementById('pending-users-list');
        pendingUsersList.innerHTML = '';
        
        pendingUsers.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.platform_id}</td>
                <td>
                    <button onclick="approveUser(${user.id})">อนุมัติ</button>
                    <button onclick="rejectUser(${user.id})">ปฏิเสธ</button>
                </td>
            `;
            pendingUsersList.appendChild(row);
        });
    } catch (error) {
        console.error('โหลดรายการผู้ใช้รออนุมัติล้มเหลว:', error);
    }
}

// อนุมัติผู้ใช้
async function approveUser(userId) {
    try {
        const response = await fetchWithAuth(`/api/admin/approve-user/${userId}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            alert('อนุมัติผู้ใช้สำเร็จ');
            loadPendingUsers(); // รีโหลดรายการผู้ใช้รออนุมัติ
        }
    } catch (error) {
        console.error('อนุมัติผู้ใช้ล้มเหลว:', error);
    }
}

// ระงับการใช้งานผู้ใช้
async function deactivateUser(userId) {
    try {
        const response = await fetchWithAuth(`/api/admin/deactivate-user/${userId}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            alert('ระงับการใช้งานผู้ใช้สำเร็จ');
            loadUsers(); // รีโหลดรายการผู้ใช้
        }
    } catch (error) {
        console.error('ระงับการใช้งานผู้ใช้ล้มเหลว:', error);
    }
}

// ฟังก์ชันดึงข้อมูลแบบปลอดภัย
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        window.location.href = '/login';
        return null;
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    
    try {
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('adminToken');
            window.location.href = '/login';
            return null;
        }
        
        if (!response.ok) {
            throw new Error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        }
        
        return response;
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการเรียก API:', error);
        throw error;
    }
}

// โหลดข้อมูลสถิติ
async function loadDashboardStats() {
    try {
        const response = await fetchWithAuth('/api/admin/dashboard/stats');
        const stats = await response.json();
        
        document.getElementById('total-users').textContent = stats.total_users || 0;
        document.getElementById('online-users').textContent = stats.pending_users || 0;
        document.getElementById('premium-users').textContent = stats.active_users || 0;
    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        
        // แสดงข้อความแจ้งเตือนให้ผู้ใช้
        alert('ไม่สามารถโหลดข้อมูลสถิติได้ กรุณาลองใหม่อีกครั้ง');
    }
}

// เพิ่มการตรวจสอบการเข้าสู่ระบบ
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    // แสดงชื่อผู้ใช้
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    document.getElementById('username').textContent = user.username || 'แอดมิน';
}

// ออกจากระบบ
document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/login';
});

// เรียกใช้งานเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadDashboardStats();
});

function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/login';
        return false;
    }
    return true;
}

// เรียกใช้งานเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
        // แสดงชื่อผู้ใช้
        const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
        document.getElementById('username').textContent = user.username || 'แอดมิน';
        
        // โหลดข้อมูลสถิติ
        loadDashboardStats();
    }
});