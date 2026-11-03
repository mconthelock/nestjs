# PS Adjust API

คู่มือเรียก CRUD ของ WEBFORM.ADJORDREQ, ADJREASONMST และ ADJODRATTFILE

## URL และรูปแบบข้อมูล

Base URL: `http://localhost:3000` (เปลี่ยน host/port ตาม deployment; PORT ตั้งค่าผ่าน environment) ไม่มี global prefix ในแอปปัจจุบัน หาก proxy เพิ่ม prefix ให้เติมเอง
ส่ง JSON ด้วย Content-Type: application/json และใช้ชื่อ field ตัวพิมพ์ใหญ่

| ตาราง         | POST (เพิ่ม)                | GET / PATCH / DELETE |
| ------------- | --------------------------- | -------------------- |
| ADJREASONMST  | /ps-adj/reasons             | /ps-adj/reasons      |
| ADJORDREQ     | /ps-adj/insert_adjust       | /ps-adj/orders       |
| ADJODRATTFILE | /ps-adj/insert_files_adjust | /ps-adj/files        |

ฟังก์ชันเพิ่มรายการใช้ชื่อ `insert_adjust` และเพิ่มข้อมูลไฟล์แนบใช้ชื่อ `insert_files_adjust` ตรงกันใน Controller, Service และ Repository
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

POST ของ CRUD ด้านล่างบันทึกครั้งละหนึ่งแถวและไม่สร้าง Form/Flow; หากต้องการสร้าง Form/Flow พร้อมรายการ ให้ใช้ auto_insert_adjust ตามหัวข้อท้ายคู่มือ

### 1. เพิ่มเหตุผล

POST /ps-adj/reasons

```json
{ "REASONNO": "1", "REASON": "Quantity adjustment", "CSTDESC": "Y" }
```

### 2. เพิ่มรายการ adjust

POST /ps-adj/insert_adjust

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

POST /ps-adj/insert_files_adjust

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

Path upload file : \\amecnas\AMECWEB\Adjust

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

## สร้าง Form/Flow และเพิ่มรายการ adjust อัตโนมัติ

`POST {{BASE_URL}}/ps-adj/auto_insert_adjust`

ตัวอย่าง BASE_URL สำหรับระบบทดสอบ: `https://amecwebtest.mitsubishielevatorasia.co.th/api`
เลือก Method **POST**, Body → raw → JSON และตั้ง `Content-Type: application/json`

รับ object ชุดเดียวหรือ array ของ object หลายชุด ใช้ข้อมูลเหมือน `insert_adjust` แต่ไม่ต้องส่ง `CYEAR2` และ `NRUNNO`; สำหรับ endpoint นี้ `DWGNO` เป็น string บังคับ ยาวไม่เกิน 17 ตัวอักษร และต้องเพิ่ม:

| Field   | Type   | จำเป็น | ความหมาย                                             |
| ------- | ------ | ------ | ---------------------------------------------------- |
| REQBY   | string | ใช่    | รหัสพนักงานผู้ขอ ต้องมีอยู่ในระบบ ใช้กำหนดสายอนุมัติ |
| INPUTBY | string | ใช่    | รหัสพนักงานผู้บันทึก ต้องมีอยู่ในระบบ                |

```json
{
    "NFRMNO": 1,
    "VORGNO": "050301",
    "CYEAR": "26",
    "REQBY": "10001",
    "INPUTBY": "10002",
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

เปลี่ยน REQBY และ INPUTBY เป็นรหัสจริง และตรวจว่ามี form master/flow master ของ NFRMNO, VORGNO, CYEAR และ reason ที่ระบุแล้ว

ระบบสร้าง Form/Flow ด้วย FormCreateService เช่นเดียวกับ jig, ใช้ปีปัจจุบันและเลข running ที่ระบบสร้าง แล้วเรียก insert_adjust ด้วย key ที่ได้ แต่ละชุดใช้ transaction แยกกัน หากล้มเหลวจะ rollback เฉพาะชุดนั้น ไม่มีการส่ง DRAFT หรืออนุมัติเอกสารเพิ่มเติมโดย endpoint นี้

ตัวอย่าง response HTTP 201 (ค่า CYEAR2 และ NRUNNO เป็นเพียงตัวอย่าง):

```json
{
    "status": true,
    "data": {
        "NFRMNO": 1,
        "VORGNO": "050301",
        "CYEAR": "26",
        "CYEAR2": "2026",
        "NRUNNO": 42,
        "CNTLNO": "00000000001"
    }
}
```

นำ form key 5 ช่องจาก `data` ไปใช้กับ `insert_files_adjust` พร้อม ID และ SFILE ได้ ไม่ต้องเรียก `insert_adjust` ซ้ำ เพราะบันทึกรายการ adjust แล้ว

400: ข้อมูลไม่ครบหรือชนิดไม่ถูกต้อง; 404: ไม่พบพนักงานตามการตรวจของ FormCreateService; 409/422: ใช้ความหมายเดียวกับ insert_adjust
ก่อนสร้าง Form/Flow จะตรวจ DWGNO ตรงกันทั้งตาราง ADJORDREQ โดยไม่จำกัดปีหรือ form key ถ้ามีอยู่แล้วจะข้าม จึงไม่สร้างเอกสารใหม่เมื่อส่ง DWGNO เดิมซ้ำ (รวมถึงซ้ำภายใน array หลังชุดแรกบันทึกสำเร็จ) การเปรียบเทียบใช้ค่าตามที่ส่งและเงื่อนไข equality ของ Oracle โดย API ไม่เปลี่ยนตัวพิมพ์หรือ trim ช่องว่าง

### ส่งหลายชุดในครั้งเดียว

ใช้ URL เดิม `POST {{BASE_URL}}/ps-adj/auto_insert_adjust` โดยส่ง array โดยตรง:

```json
[
    {
        "NFRMNO": 1,
        "VORGNO": "050301",
        "CYEAR": "26",
        "REQBY": "10001",
        "INPUTBY": "10002",
        "CNTLNO": "00000000001",
        "DWGNO": "DWG001",
        "QTY": "10"
    },
    {
        "NFRMNO": 1,
        "VORGNO": "050301",
        "CYEAR": "26",
        "REQBY": "10001",
        "INPUTBY": "10002",
        "CNTLNO": "00000000002",
        "DWGNO": "DWG002",
        "QTY": "20"
    }
]
```

ระบบตรวจรูปแบบข้อมูลทุกชุดก่อนเริ่มบันทึก หากมีชุดที่ validation ไม่ผ่านจะตอบ HTTP 400 พร้อม index (เริ่มที่ 0) และยังไม่บันทึกชุดใด ไม่รับ array ว่าง

เมื่อข้อมูลผ่าน validation จะประมวลผลตามลำดับทีละชุด:

1. ล็อกและตรวจ DWGNO ใน ADJORDREQ
2. ถ้ามีแล้ว คืนสถานะ skipped โดยไม่สร้าง Form/Flow
3. ถ้ายังไม่มี สร้าง Form/Flow และบันทึก adjust แล้วคืนสถานะ created พร้อม key
4. หากขั้นตอนฐานข้อมูลของชุดนั้นผิดพลาด rollback เฉพาะชุดนั้น คืน failed แล้วทำชุดถัดไป

ตัวอย่าง response HTTP 201 ของ batch (ให้ตรวจผลรายชุด ไม่ใช้ HTTP status ตัดสินว่าทุกชุดสำเร็จ):

```json
{
    "total": 2,
    "created": 1,
    "skipped": 1,
    "failed": 0,
    "items": [
        {
            "index": 0,
            "DWGNO": "DWG001",
            "status": "skipped",
            "reason": "DWGNO already exists"
        },
        {
            "index": 1,
            "DWGNO": "DWG002",
            "status": "created",
            "data": {
                "NFRMNO": 1,
                "VORGNO": "050301",
                "CYEAR": "26",
                "CYEAR2": "2026",
                "NRUNNO": 42,
                "CNTLNO": "00000000002"
            }
        }
    ]
}
```

รายการ failed จะมี message อธิบายข้อผิดพลาด; รายการ skipped ไม่มี key ใหม่
หากส่ง object ชุดเดียวและพบ DWGNO เดิม จะตอบ HTTP 201 พร้อม `{ "status": "skipped", "reason": "DWGNO already exists" }`; หากเพิ่มสำเร็จยังคืน `{ "status": true, "data": { ... } }` ตามรูปแบบเดิม

การตรวจและ insert ใช้ table lock ของ FORM และ ADJORDREQ ภายใน transaction เพื่อป้องกันการตรวจผ่านพร้อมกันสองคำขอ จึงอาจรอ transaction อื่นที่กำลังเขียนตารางเหล่านี้; CRUD insert_adjust เดิมยังเป็นการ insert โดยตรงและไม่ได้เพิ่มเงื่อนไขข้าม DWGNO ซ้ำ

### แก้ปัญหา FORMMST not found / VFORMPAGE

หากชุดที่ไม่ซ้ำล้มเหลวด้วย `Cannot read properties of undefined (reading 'VFORMPAGE')` แสดงว่าขั้นตอนสร้าง Form ไม่พบ form master ตาม NFRMNO, VORGNO, CYEAR ที่ส่งมา โค้ดที่ปรับแล้วจะคืน `FORMMST not found: NNO=..., VORGNO=..., CYEAR=...` แทน

ใช้ SQL นี้ตรวจสอบ (ตัวอย่างจาก payload ทดสอบ):

```sql
SELECT NNO, VORGNO, CYEAR, VANAME, VNAME, VFORMPAGE
FROM WEBFORM.FORMMST
WHERE NNO = 1 AND VORGNO = '050301' AND CYEAR = '26';
```

หากไม่พบ ให้ค้นหา form master ของ adjust ที่มีจริง แล้วนำ NNO ไปส่งเป็น NFRMNO พร้อม VORGNO และ CYEAR จากแถวนั้น ค่า 1 / 050301 / 26 ในตัวอย่างเป็นเพียงตัวอย่าง ไม่ได้ยืนยันว่ามีอยู่ในฐานข้อมูลของ deployment

```sql
SELECT NNO, VORGNO, CYEAR, VANAME, VNAME, VFORMPAGE
FROM WEBFORM.FORMMST
WHERE VORGNO = '050301'
ORDER BY NNO, CYEAR;
```

CYEAR เป็นส่วนหนึ่งของรหัส form master ไม่ใช่ค่าที่ต้องเปลี่ยนตามปีปัจจุบันเสมอไป ส่วน CYEAR2 ระบบจะสร้างเอง หากยังไม่มี master สำหรับ adjust ต้องตั้งค่า form master และ flow master ให้ถูกต้องก่อนเรียก auto API
