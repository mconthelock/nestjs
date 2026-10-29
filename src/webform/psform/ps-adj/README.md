# PS Adjust API

คู่มือเรียก CRUD ของ WEBFORM.ADJORDREQ, ADJREASONMST และ ADJODRATTFILE

## URL และรูปแบบข้อมูล

Base URL: `http://localhost:3000` (เปลี่ยน host/port ตาม deployment; PORT ตั้งค่าผ่าน environment) ไม่มี global prefix ในแอปปัจจุบัน หาก proxy เพิ่ม prefix ให้เติมเอง
ส่ง JSON ด้วย Content-Type: application/json และใช้ชื่อ field ตัวพิมพ์ใหญ่

| ตาราง         | URL             |
| ------------- | --------------- |
| ADJREASONMST  | /ps-adj/reasons |
| ADJORDREQ     | /ps-adj/orders  |
| ADJODRATTFILE | /ps-adj/files   |

ทุก URL รองรับ POST (เพิ่ม), GET (ค้นหา), PATCH (แก้ไข), DELETE (ลบ)
POST ส่ง key และข้อมูลใน body; GET ส่ง key ที่ต้องการกรองผ่าน query string (ไม่ส่ง = 100 รายการแรก เรียงตาม primary key); PATCH และ DELETE ต้องส่ง key ครบผ่าน query string; PATCH ส่งเฉพาะข้อมูลที่แก้ใน body ห้ามเปลี่ยน primary key

## ชนิดข้อมูล

### ADJREASONMST

| Field    | JSON type | Oracle type  | จำเป็นตอน insert       |
| -------- | --------- | ------------ | ---------------------- |
| REASONNO | string    | CHAR(1)      | ใช่ (primary key)      |
| REASON   | string    | VARCHAR2(25) | ไม่; ละได้หรือส่ง null |
| CSTDESC  | string    | CHAR(1)      | ไม่; ละได้หรือส่ง null |

### ADJORDREQ

| Field     | JSON type          | Oracle type   | จำเป็นตอน insert       |
| --------- | ------------------ | ------------- | ---------------------- |
| NFRMNO    | number (จำนวนเต็ม) | NUMBER(3)     | ใช่ (primary key)      |
| VORGNO    | string             | VARCHAR2(6)   | ใช่ (primary key)      |
| CYEAR     | string             | CHAR(2)       | ใช่ (primary key)      |
| CYEAR2    | string             | CHAR(4)       | ใช่ (primary key)      |
| NRUNNO    | number (จำนวนเต็ม) | NUMBER(6)     | ใช่ (primary key)      |
| CNTLNO    | string             | VARCHAR2(11)  | ใช่ (primary key)      |
| ORDERNO   | string             | VARCHAR2(9)   | ไม่; ละได้หรือส่ง null |
| PROCID    | string             | VARCHAR2(6)   | ไม่; ละได้หรือส่ง null |
| QTY       | string             | VARCHAR2(6)   | ไม่; ละได้หรือส่ง null |
| DWGNO     | string             | VARCHAR2(17)  | ไม่; ละได้หรือส่ง null |
| DWGDESC   | string             | VARCHAR2(16)  | ไม่; ละได้หรือส่ง null |
| JUN       | string             | VARCHAR2(7)   | ไม่; ละได้หรือส่ง null |
| STOCKCODE | string             | VARCHAR2(15)  | ไม่; ละได้หรือส่ง null |
| PRNO      | number (จำนวนเต็ม) | NUMBER(8)     | ไม่; ละได้หรือส่ง null |
| LINENO    | number (จำนวนเต็ม) | NUMBER(8)     | ไม่; ละได้หรือส่ง null |
| VENDNO    | number (จำนวนเต็ม) | NUMBER(5)     | ไม่; ละได้หรือส่ง null |
| REVQTY    | string             | VARCHAR2(6)   | ไม่; ละได้หรือส่ง null |
| REASONNO  | string             | CHAR(1)       | ไม่; ละได้หรือส่ง null |
| DESCRIBE  | string             | VARCHAR2(225) | ไม่; ละได้หรือส่ง null |

### ADJODRATTFILE

| Field  | JSON type          | Oracle type  | จำเป็นตอน insert       |
| ------ | ------------------ | ------------ | ---------------------- |
| NFRMNO | number (จำนวนเต็ม) | NUMBER(3)    | ใช่ (primary key)      |
| VORGNO | string             | VARCHAR2(6)  | ใช่ (primary key)      |
| CYEAR  | string             | CHAR(2)      | ใช่ (primary key)      |
| CYEAR2 | string             | CHAR(4)      | ใช่ (primary key)      |
| NRUNNO | number (จำนวนเต็ม) | NUMBER(6)    | ใช่ (primary key)      |
| ID     | string             | CHAR(2)      | ใช่ (primary key)      |
| SFILE  | string             | VARCHAR2(70) | ไม่; ละได้หรือส่ง null |

NUMBER ต้องเป็นจำนวนเต็มภายใน precision ที่ระบุ; CHAR ของ primary key ต้องยาวตรงตามกำหนด; VARCHAR2 จำกัดความยาวตามตาราง ค่ารหัสและจำนวนที่เก็บเป็น VARCHAR2 เช่น QTY, REVQTY ให้ส่ง string เพื่อรักษาเลขศูนย์นำหน้า ห้ามส่ง null ให้ primary key
ความยาวที่ API ตรวจเป็นจำนวนตัวอักษร หาก Oracle ใช้ BYTE semantics ข้อความหลายไบต์อาจเกินขนาดที่ฐานข้อมูลรองรับได้

## ลำดับการ insert

1. สร้าง reason หรือใช้ REASONNO ที่มีอยู่แล้ว
2. เพิ่ม order โดย REASONNO ต้องมีใน ADJREASONMST หากระบุ; ไม่ได้สร้าง FORM ให้อัตโนมัติ
3. เพิ่ม file โดยต้องมี FORM ที่ตรงกับ NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO อยู่แล้ว

แต่ละ POST บันทึกหนึ่งแถว แยก transaction จากกัน ไม่ใช่การ submit workflow หรือสร้างเอกสารทั้งชุด

### 1. เพิ่มเหตุผล

POST /ps-adj/reasons

```json
{ "REASONNO": "1", "REASON": "Quantity adjustment", "CSTDESC": "Y" }
```

### 2. เพิ่มรายการ adjust

POST /ps-adj/orders

```json
{
    "NFRMNO": 1,
    "VORGNO": "050301",
    "CYEAR": "26",
    "CYEAR2": "2026",
    "NRUNNO": 1,
    "CNTLNO": "00000000001",
    "ORDERNO": "123456789",
    "PROCID": "P001",
    "QTY": "10",
    "DWGNO": "DWG001",
    "DWGDESC": "Bracket",
    "JUN": "001",
    "STOCKCODE": "ST001",
    "PRNO": 12345678,
    "LINENO": 1,
    "VENDNO": 12345,
    "REVQTY": "12",
    "REASONNO": "1",
    "DESCRIBE": "Adjust quantity to 12"
}
```

### 3. เพิ่มข้อมูลไฟล์แนบ

POST /ps-adj/files

```json
{
    "NFRMNO": 1,
    "VORGNO": "050301",
    "CYEAR": "26",
    "CYEAR2": "2026",
    "NRUNNO": 1,
    "ID": "01",
    "SFILE": "adjust-001.pdf"
}
```

SFILE เป็นชื่อไฟล์หรือ path ที่จัดเก็บเท่านั้น endpoint นี้ไม่ upload binary และไม่สร้างไฟล์บน disk
ค่าตัวอย่างของ form key ต้องเปลี่ยนให้ตรงกับ FORM จริงก่อนเพิ่ม file

## ตัวอย่าง curl

```sh
curl -X POST 'http://localhost:3000/ps-adj/reasons' -H 'Content-Type: application/json' -d '{"REASONNO":"1","REASON":"Quantity adjustment","CSTDESC":"Y"}'
curl 'http://localhost:3000/ps-adj/orders?NFRMNO=1&VORGNO=050301&CYEAR=26&CYEAR2=2026&NRUNNO=1'
curl -X PATCH 'http://localhost:3000/ps-adj/orders?NFRMNO=1&VORGNO=050301&CYEAR=26&CYEAR2=2026&NRUNNO=1&CNTLNO=00000000001' -H 'Content-Type: application/json' -d '{"REVQTY":"15","DESCRIBE":null}'
curl -X DELETE 'http://localhost:3000/ps-adj/files?NFRMNO=1&VORGNO=050301&CYEAR=26&CYEAR2=2026&NRUNNO=1&ID=01'
```

สำหรับ reasons ใช้ query REASONNO=1; orders ใช้ form key 5 ช่อง + CNTLNO; files ใช้ form key 5 ช่อง + ID

## Response และข้อผิดพลาด

POST สำเร็จ: HTTP 201, PATCH/DELETE สำเร็จ: HTTP 200 โดย body เป็น { "status": true }
GET สำเร็จ: HTTP 200 และ array ของแถวข้อมูล; ไม่พบคืน []
400: validation ไม่ผ่าน/ไม่มี field ให้แก้ไข; 404: ไม่พบแถวที่แก้ไขหรือลบ; 409: primary key ซ้ำหรือกำลังถูกอ้างอิง; 422: ไม่พบ reason หรือ FORM ที่อ้างอิง
ข้อผิดพลาดฐานข้อมูลอื่นใช้ error handler เดิมของระบบ
Field ที่ไม่ได้ประกาศจะถูก whitelist ตัดออก; key ใน body ของ PATCH จะไม่ถูกแก้ไข และหากไม่เหลือ field จะตอบ 400

## โครงสร้าง implementation

Controller → Service → PsAdjRepository → BaseRepository → webformConnection
Entity อยู่ src/common/Entities/webform/table; Module ถูกลงทะเบียนใน PsFormModule
ไม่มี migration/DDL หรือ DROP TABLE ทำงานผ่าน API นี้ ต้องมีตารางใน Oracle ก่อนใช้งาน

## ตรวจสอบสำหรับผู้พัฒนา

```sh
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/jest/bin/jest.js --runInBand --config src/webform/psform/ps-adj/jest.config.cjs
```

ชุดทดสอบใช้ mock repository และยังไม่ได้เชื่อม Oracle จริง
