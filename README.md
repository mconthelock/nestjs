# How to install project

1. Git clone project from GitLab repo and install dependency

```sh
git clone
git install
cp \\amecnas\amecweb\file\env\api\.env .env
```

3. Install oracle instant_client

```sh
cp \\amecnas\amecweb\file\orcle\instantclient_23_0 C:/oracle/instantclient_23_0
```

2. Start dev by use commnand

```sh
npm run start:dev
```

# Check list for monitor build's perfomance

## 1. เช็คลิสต์ช่วง Compile Code (แปลง TypeScript เป็น JavaScript)

##### เป้าหมาย: ตรวจสอบว่าความช้าเกิดจากจำนวนไฟล์หรือกระบวนการคอมไพล์โค้ดหรือไม่

[ ] เช็คเวลาประมวลผลของ Compiler เดิม (tsc): รันคำสั่ง `npx tsc --noEmit --extendedDiagnostics`
[ ] ตรวจสอบ tsconfig.json: ตรวจสอบว่ามีการข้ามไฟล์ที่ไม่จำเป็นเพื่อลดภาระ Compiler

- เพิ่ม `"skipLibCheck": true` ใน compilerOptions
- เพิ่ม `"exclude": ["node_modules", "dist"]`

[ ] ตรวจสอบ Circular Dependencies: รันคำสั่ง `npx madge --circular --extensions ts src`

```
Verification: หากไม่มีรายชื่อไฟล์แสดงขึ้นมา แสดงว่าไม่มีปัญหาการ Import วนลูปที่ทำให้ Compiler สับสน
```

[ ] เปลี่ยนไปใช้ SWC (Speedy Web Compiler): หากลองข้อด้านบนแล้วยังช้า ให้ติดตั้ง `@swc/cli` และ `@swc/core` แล้วเปิดใช้งาน `"builder": "swc" ` ใน `nest-cli.json`

> [!NOTE]
> ตอนนี้ npm run start:dev ด้วย tsc ช้ากว่า SWC (ราว 35 วินาทีในรอบที่ผมลอง) ถ้าอยากใช้ SWC ต้องแก้คอลัมน์ | null ทุกตัวให้ระบุ type: เอง และเปลี่ยนความสัมพันธ์ของ entity ที่ import วนกันให้เป็น Relation<...>

## 2. เช็คลิสต์ช่วง Boot & Connected (เริ่มแอปพลิเคชันและต่อ Database)

[ ] ทดสอบ Comment โค้ดเชื่อมต่อ Database ทีละตัว: ลอง Comment ส่วน `TypeOrmModule.forRoot()` หรือ Config DB ตัวใดตัวหนึ่งออก แล้วกด Save โค้ด

```
Verification: หากแอปพลิเคชันแสดงคำว่า successfully started เร็วขึ้นอย่างเห็นได้ชัด แสดงว่าปัญหาอยู่ที่ Network หรือ Driver ของ DB ตัวนั้น
```

[ ] ตรวจสอบการตั้งค่า Keep Connection Alive (สำหรับ TypeORM):

ตรวจสอบใน Config ว่ามีการเพิ่ม `"keepConnectionAlive": true` (เฉพาะในโหมด Development) เพื่อให้นำ Connection Pool เดิมมาใช้ซ้ำตอนที่ NestJS ทำ Hot Reload

[ ] ตรวจสอบ Network และปรับ Timeout: หาก DB บางตัวอยู่บน Server แยกต่างหาก (เช่น Oracle บน On-premise) ให้ลองปรับลดค่า connectTimeout ลง

```
Verification: หาก Network มีปัญหา แอปจะ Timeout และแจ้งเตือนเร็วขึ้นโดยไม่ต้องรอจนค้างไปนานๆ
```
