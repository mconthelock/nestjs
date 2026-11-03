# Benchmark Tools สำหรับวัดประสิทธิภาพระบบ

ชุดเครื่องมือวัดประสิทธิภาพความเร็วของ Application สำหรับทีมพัฒนา เพื่อใช้เปรียบเทียบเวลาในการบูตระบบระหว่างเครื่องต่างๆ ในทีม

---

## 🛠️ คำสั่งที่มีให้ใช้งาน

### 1. วัดความเร็วของ `npm run start:dev` จริง (โหมด Development) ⭐️
คำสั่งนี้จะรัน `nest start --swc` จริงๆ โดยดักจับแต่ละ Milestone ตั้งแต่เริ่มเรียก SWC Compiler, โหลดไฟล์โค้ด, เชื่อมต่อ Database, จนกระทั่งเปิดพอร์ตพร้อมรับ Request:
```bash
npm run benchmark:dev
```
*(หรือ `npm run benchmark`)*

**สิ่งที่แสดงผล:**
* ข้อมูลสเปกฮาร์ดแวร์ของเครื่อง (CPU Model, Cores, RAM, OS, Node version)
* เวลาที่ใช้ใน **Phase 1: SWC Rust Compiler** (แปลงโค้ด 2,900+ ไฟล์)
* เวลาที่ใช้ใน **Phase 2: Code Modules Import & DI Resolution** (Node.js โหลด 427 Modules)
* เวลาที่ใช้ใน **Phase 3: Database & TypeORM Metadata** (เชื่อมต่อ 8 Database Pools + Redis)
* เวลาที่ใช้ใน **Phase 4: HTTP Listen & Ready**
* สรุปเปอร์เซ็นต์ (% Ratio) และคำแนะนำในการจูนแต่ละเครื่อง

---

### 2. วัดความเร็วของ Production / Docker Container (โหมด Production)
คำสั่งนี้จะวัดความเร็วของตัว Application Runtime ล้วนๆ (บนโค้ดที่ build แล้วใน `dist/`) โดยไม่มี Overhead ของ Compiler และ Watcher:
```bash
npm run benchmark:prod
```

**สิ่งที่แสดงผล:**
* ตารางทดสอบและจับเวลาของ Database ทั้ง 8 ตัวแยกย่อยรายตัว (`Connect ms` และ `Ping ms`)
* เวลาที่ตัว NestJS Engine ใช้ในการบูตบน Server หรือ Docker จริง (ประมาณ ~8-10 วินาที)
