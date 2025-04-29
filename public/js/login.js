document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // บันทึก Token และข้อมูลผู้ใช้
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data.user));
            
            // เปลี่ยนหน้าไปยังแดชบอร์ด
            window.location.href = '/admin';
        } else {
            errorMessage.textContent = data.message || 'เข้าสู่ระบบล้มเหลว';
        }
    } catch (error) {
        errorMessage.textContent = 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
    }
});