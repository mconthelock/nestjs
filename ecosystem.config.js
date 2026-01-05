module.exports = {
  apps: [
    {
      name: 'api', // ชื่อแอปใน PM2
      script: './dist/main.js', // จุดที่รันหลัง build เสร็จ
      instances: 'max', // รันแบบ Cluster (ใช้ CPU ทุก Core) หรือใส่ตัวเลขเช่น 2, 4
      exec_mode: 'cluster', // โหมด Cluster ช่วยให้แอปไม่ล่มง่าย
      autorestart: true, // ถ้าแอปค้างหรือล่ม ให้มัน restart เอง
      watch: false, // บน Production ไม่ควรเปิด watch
      max_memory_restart: '1G', // ถ้า RAM พุ่งเกิน 1GB ให้ restart (กัน memory leak)
      // การจัดการ Log
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
