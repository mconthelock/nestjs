# System Benchmark Tools

เครื่องมือสำหรับวัดประสิทธิภาพความเร็วของ Database Connections และขั้นตอนการ Boot ระบบของ NestJS Application

## 📂 รายการไฟล์ในโฟลเดอร์นี้

* `index.js`: สคริปต์หลักสำหรับรัน Benchmark ทั้งหมด (ทดสอบ Database ทั้ง 8 ตัว + วัดความเร็วแต่ละช่วงของ NestJS Startup)

---

## 🚀 วิธีการใช้งาน

### 1. Build โค้ดล่าสุดก่อน (หากเพิ่งมีการแก้ไขโค้ด)
```bash
npm run build
```

### 2. รัน Benchmark
สามารถสั่งรันผ่านคำสั่ง npm ได้ทันทีจาก Root directory:
```bash
npm run benchmark
```
หรือรันโดยตรงด้วย Node.js:
```bash
node scripts/benchmark/index.js
```

---

## 📊 ข้อมูลที่ได้จากรายงาน (Report Summary)

1. **Database Connections Table**:
   * วัดเวลา Handshake/Init Connection ของแต่ละฐานข้อมูล (`Connect ms`)
   * วัดเวลา Ping Query (`Ping ms`)
   * เวลารวม และสถานะ `OK ✅` หรือ `FAILED ❌` พร้อม Error ชัดเจนกรณีต่อไม่ได้

2. **Startup Phases Breakdown Table**:
   * **Phase 1: Oracle Client Init** (เวลาเริ่ม Client lib)
   * **Phase 2: Code Import & Modules Evaluation** (เวลาอ่านและโหลดไฟล์โค้ด ~2,900 ไฟล์ขึ้น RAM)
   * **Phase 3: DI Resolution & NestFactory.create** (เวลาสร้าง Dependency Injection Container)
   * **Phase 4: app.init()** (เวลาผูก TypeORM Pool, Metadata และ Lifecycle hooks)
   * **Total Time**: เวลาสุทธิที่ระบบพร้อมรับ Request

