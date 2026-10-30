# คู่มือเรียกใช้ TS Process API (IE-TS)

API สำหรับบันทึกหัวฟอร์ม รายละเอียด process และชื่อไฟล์แนบ โดยใช้ repository จัดการตาราง `IEDOC.PROC_TSHEADFORM`, `IEDOC.PROC_TSDETFORM`, `IEDOC.PROC_TSATTFILE`

## URL และรูปแบบคำขอ

กำหนด `BASE_URL` เป็น root URL ของ API ที่ใช้งาน เช่น `http://localhost:3000` (เปลี่ยน host, port และ reverse proxy prefix ตาม deployment จริง) และส่ง `Content-Type: application/json` สำหรับ POST/PUT

| Method | URL | หน้าที่ |
| --- | --- | --- |
| POST | `{{BASE_URL}}/ieform/ie-ts/insert_ts_process` | เพิ่ม TS ลงใน Form ที่สร้างไว้แล้ว |
| POST | `{{BASE_URL}}/ieform/ie-ts/auto_insert_ts_process` | สร้าง Form/Flow แล้วเพิ่ม TS โดยใช้เลขฟอร์มที่ระบบสร้าง |
| GET | `{{BASE_URL}}/ieform/ie-ts/get_ts_process` | อ่านข้อมูล TS ทั้ง 3 ตารางของฟอร์ม |
| PUT | `{{BASE_URL}}/ieform/ie-ts/update_ts_process` | แทนที่ข้อมูล TS ทั้งชุดของฟอร์ม |
| DELETE | `{{BASE_URL}}/ieform/ie-ts/delete_ts_process` | ลบข้อมูล TS ทั้ง 3 ตารางของฟอร์ม |

ชื่อ field เป็น **ตัวพิมพ์ใหญ่ตามตัวอย่าง** และชื่อ route เป็นตัวพิมพ์เล็ก อ่านและลบใช้ query string; เพิ่มและแก้ไขใช้ JSON body

## 1. เพิ่มข้อมูลปกติ: insert_ts_process

ใช้เมื่อมี `WEBFORM.FORM` และได้ `CYEAR2`, `NRUNNO` มาแล้ว API นี้ไม่สร้าง Form/Flow และไม่คำนวณเลขฟอร์มใหม่ คำขอหนึ่งครั้งบันทึก TS ทั้งฟอร์ม โดยมีหลายหัวรายการ (`SEQ`) ได้

### Field ระดับบน

| Field | ชนิด | จำเป็น | รายละเอียด |
| --- | --- | --- | --- |
| NFRMNO | integer | ใช่ | รหัสชนิดฟอร์ม 1–9999; ถ้ามี FILES ต้องไม่เกิน 999 เพราะ PROC_TSATTFILE ใช้ NUMBER(3) |
| VORGNO | string | ใช่ | รหัสหน่วยงาน ไม่เกิน 6 ตัวอักษร |
| CYEAR | string | ใช่ | ปีของ master ฟอร์ม ตัวเลข 2 หลัก เช่น `"26"`; ใช้ค่าที่ตั้งไว้ใน FORMMST |
| CYEAR2 | string | ใช่ | ปีของเลขเอกสาร ตัวเลข 4 หลัก เช่น `"2026"` |
| NRUNNO | integer | ใช่ | เลข running 1–999999 |
| HEADERS | array of object | ใช่ | อย่างน้อย 1 รายการ; บันทึก PROC_TSHEADFORM |
| DETAILS | array of object | ไม่ | บันทึก PROC_TSDETFORM; ไม่ส่ง/null/[] หมายถึงไม่มีรายละเอียด |
| FILES | array of object | ไม่ | บันทึก PROC_TSATTFILE; ไม่ส่ง/null/[] หมายถึงไม่มีไฟล์ |

ห้ามส่ง key ฟอร์มซ้ำลงในแต่ละ object ของ HEADERS/DETAILS/FILES ระบบเติม key ทั้ง 5 ช่องจากระดับบนให้ทุกแถว

### HEADERS[]

| Field | ชนิด | จำเป็น | ความยาวสูงสุด / ความหมาย |
| --- | --- | --- | --- |
| SEQ | string | ใช่ | 3; ลำดับรายการ เช่น `"001"`; ห้ามซ้ำในฟอร์มเดียวกัน |
| DWGNO | string/null | ไม่ | 9 |
| GNO | string/null | ไม่ | 3 |
| LNO | string/null | ไม่ | 3 |
| REVISION | string/null | ไม่ | 2 |
| ITEMNO | string/null | ไม่ | 3 |
| INPUTDATE | ISO date string/null | ไม่ | เช่น `"2026-10-29"` หรือ `"2026-10-29T09:00:00+07:00"`; ส่งเวลาพร้อม timezone เมื่อต้องการระบุเวลา |
| EFFJUN | string/null | ไม่ | 5 |
| IDTAGJUN | string/null | ไม่ | 5 |
| VDETAIL | string/null | ไม่ | 4000 |
| TSFLAG | string/null | ไม่ | 1; ถ้าระบุ ต้องมีอยู่ใน IEDOC.TSFLAGMST ตาม foreign key ของฐานข้อมูล |
| LNO2 | string/null | ไม่ | 3 |
| PLANJUN | string/null | ไม่ | 5 |
| TSFLAG_DETAIL | string/null | ไม่ | 500 |
| PNO | string/null | ไม่ | 2 |

### DETAILS[]

| Field | ชนิด | จำเป็น | ความยาวสูงสุด / ความหมาย |
| --- | --- | --- | --- |
| SEQ | string | ใช่ | 3; ต้องตรงกับ SEQ ใน HEADERS ของคำขอเดียวกัน |
| PROCID | string | ใช่ | 6; process ใหม่ |
| PROCID_OLD | string | ใช่ | 6; process เดิม |
| TP_OLD | string/null | ไม่ | 5 |
| TC_OLD | string/null | ไม่ | 6 |
| TP | string/null | ไม่ | 5 |
| TC | string/null | ไม่ | 6 |
| SEQ_PROC | string/null | ไม่ | 2 |
| DWG | string/null | ไม่ | 9 |
| GNO | string/null | ไม่ | 3 |
| LNO | string/null | ไม่ | 7; ต่างจาก LNO ของ HEADERS ที่ยาวได้ 3 |

คู่ `(SEQ, PROCID)` ห้ามซ้ำภายในฟอร์ม แต่ SEQ เดียวมีหลาย PROCID ได้

### FILES[]

| Field | ชนิด | จำเป็น | รายละเอียด |
| --- | --- | --- | --- |
| ID | integer | ใช่ | 0–99; ผู้เรียกกำหนดเอง ห้ามซ้ำในฟอร์มเดียวกัน |
| FILENAME | string/null | ไม่ | ไม่เกิน 200 ตัวอักษร |

FILES เป็นข้อมูลชื่อไฟล์เท่านั้น API นี้รับ JSON ไม่รับ multipart และไม่อัปโหลด ย้าย ดาวน์โหลด หรือลบไฟล์จริง ผู้เรียกต้องจัดเก็บไฟล์ผ่านระบบจัดการไฟล์ที่ใช้งานอยู่ก่อน แล้วส่งชื่อไฟล์มา

### ตัวอย่าง JSON

ค่ารหัสฟอร์ม หน่วยงาน ปี และพนักงานทั้งหมดในคู่มือนี้เป็นตัวอย่าง ต้องเปลี่ยนให้ตรงกับ master ของ TS ในระบบจริง

```json
{
  "NFRMNO": 31,
  "VORGNO": "051401",
  "CYEAR": "26",
  "CYEAR2": "2026",
  "NRUNNO": 42,
  "HEADERS": [
    {
      "SEQ": "001",
      "DWGNO": "DWG000001",
      "GNO": "001",
      "LNO": "001",
      "REVISION": "01",
      "ITEMNO": "001",
      "INPUTDATE": "2026-10-29",
      "EFFJUN": "26101",
      "IDTAGJUN": "26101",
      "VDETAIL": "เปลี่ยน process การผลิต",
      "TSFLAG": null,
      "LNO2": "002",
      "PLANJUN": "26102",
      "TSFLAG_DETAIL": "รายละเอียดการเปลี่ยนแปลง",
      "PNO": "01"
    }
  ],
  "DETAILS": [
    {
      "SEQ": "001",
      "PROCID_OLD": "P00001",
      "TP_OLD": "10",
      "TC_OLD": "20",
      "PROCID": "P00002",
      "TP": "12",
      "TC": "22",
      "SEQ_PROC": "01",
      "DWG": "DWG000001",
      "GNO": "001",
      "LNO": "0000001"
    }
  ],
  "FILES": [
    { "ID": 1, "FILENAME": "ts-process-drawing.pdf" }
  ]
}
```

ตัวอย่าง cURL: บันทึก JSON ด้านบนเป็น `insert-ts.json` แล้วเรียก

```bash
curl -X POST "{{BASE_URL}}/ieform/ie-ts/insert_ts_process" \
  -H "Content-Type: application/json" \
  --data-binary "@insert-ts.json"
```

สำเร็จ HTTP 201:

```json
{
  "status": true,
  "message": "Insert TS process successfully",
  "key": {
    "NFRMNO": 31,
    "VORGNO": "051401",
    "CYEAR": "26",
    "CYEAR2": "2026",
    "NRUNNO": 42
  }
}
```

## 2. สร้าง Form/Flow และเพิ่ม TS แบบ batch: auto_insert_ts_process

```text
POST {{BASE_URL}}/ieform/ie-ts/auto_insert_ts_process
Content-Type: application/json
```

**รูปแบบใหม่:** body เป็น JSON array แม้ส่งเพียงชุดเดียว แต่ละ object มีข้อมูลฟอร์ม 5 ช่องและ `ITEMS` ซึ่งเป็น array ของ process แบบแบน ไม่ส่ง HEADERS/DETAILS/FILES, SEQ, SEQ_PROC, CYEAR2 หรือ NRUNNO เอง และใช้ชื่อ `REQUEST_BY`/`INPUT_BY` แทน REQBY/INPUTBY ของรูปแบบเดิม

### ข้อมูลแต่ละชุดฟอร์ม

| Field | ชนิด | จำเป็น | รายละเอียด |
| --- | --- | --- | --- |
| NFRMNO | integer | ใช่ | 1–9999; รหัสชนิดฟอร์ม TS ที่ตั้งไว้จริง |
| VORGNO | string | ใช่ | หน่วยงาน ไม่เกิน 6 ตัวอักษร |
| CYEAR | string | ใช่ | ปี master ตัวเลข 2 หลัก เช่น "26" |
| REQUEST_BY | string | ใช่ | รหัสผู้ร้องขอ ไม่เกิน 6 ตัวอักษร ต้องมีในระบบพนักงาน |
| INPUT_BY | string | ใช่ | รหัสผู้บันทึก ไม่เกิน 6 ตัวอักษร ต้องมีในระบบพนักงาน |
| ITEMS | array of object | ใช่ | อย่างน้อย 1 process ตามตารางด้านล่าง |

ชุดที่ `NFRMNO/VORGNO/CYEAR/REQUEST_BY/INPUT_BY` เหมือนกันทุกช่องจะรวม ITEMS เข้าด้วยกันและได้ **1 เลขฟอร์ม** หากเปลี่ยนช่องใดช่องหนึ่งจะเป็นคนละชุดฟอร์ม ทั้งนี้จะสร้างเลขฟอร์มเฉพาะชุดที่ยังมี process ใหม่หลังตรวจซ้ำ

### ITEMS[]

| Field | ชนิด | จำเป็น | ความยาวสูงสุด / การบันทึก |
| --- | --- | --- | --- |
| DWG | string | ใช่ | 9; HEADFORM.DWGNO และ DETFORM.DWG |
| GNO | string/null | ไม่ | 3; ว่างได้ บันทึกทั้งหัวและรายละเอียด |
| LNO | string/null | ไม่ | 3; ว่างได้ จำกัดตาม HEADFORM.LNO แม้ DETFORM.LNO จะรองรับ 7 |
| ITEM | string | ใช่ | 3; บันทึก HEADFORM.ITEMNO |
| PROCID_OLD | string | ใช่ | 6; process เดิม |
| TP_OLD | string/null | ไม่ | 5 |
| TC_OLD | string/null | ไม่ | 6 |
| PROCID | string | ใช่ | 6; process ใหม่ |
| TP | string/null | ไม่ | 5 |
| TC | string/null | ไม่ | 6 |

ค่ารหัสส่งเป็น string เพื่อรักษาเลขศูนย์นำหน้า ระบบ trim ช่อง string ที่จำเป็นก่อนจัดกลุ่มและตรวจซ้ำ สำหรับ GNO/LNO สามารถส่ง `""`, ช่องว่าง, `null` หรือไม่ส่ง field ได้ โดยถือว่าเป็นค่าเดียวกันและบันทึกเป็น NULL การตรวจซ้ำใช้ IS NULL เพื่อให้ตรงกับการเก็บค่าว่างของ Oracle

### เงื่อนไขตรวจซ้ำและการสร้าง sequence

1. ตรวจใน `IEDOC.PROC_TSDETFORM` ว่ามี `DWG + GNO + LNO + PROCID_OLD` ตรงกันหรือไม่ หากพบให้ข้าม process นั้น **ไม่ใช้ ITEM หรือ PROCID ใหม่ในการตรวจซ้ำ** และไม่จำกัด NFRMNO/VORGNO/CYEAR/สถานะฟอร์มของข้อมูลเดิม
2. รายการที่ซ้ำกันภายใน batch ใช้เงื่อนไข 4 ช่องเดียวกัน เก็บรายการแรกที่พบ แม้ต่างชุดฟอร์ม หรือต่าง ITEM/PROCID ใหม่ก็ตาม
3. หากชุดใดไม่เหลือ process ใหม่ จะคืน status=skipped และ key=null โดยไม่ insert FORM, FLOW หรือ TS ของชุดนั้น หากทุกชุดซ้ำ จะไม่มีการสร้างฟอร์มเลย
4. ในแต่ละฟอร์ม จัดหัวรายการตาม `DWG + GNO + LNO + ITEM` ของรายการที่เหลือ แล้วกำหนด `SEQ=001,002,...` ตามลำดับที่พบ รองรับสูงสุด 999 หัวรายการ
5. แต่ละ process ใช้ SEQ เดียวกับหัวของตน และกำหนด `SEQ_PROC=01,02,...` ตามลำดับที่พบ เริ่ม 01 ใหม่ในแต่ละหัว รองรับสูงสุด 99 processes ต่อหัว
6. หาก process คนละ PROCID_OLD ที่เหลืออยู่ต้องใช้ PROCID ใหม่ตัวเดียวกันในหัวเดียวกัน จะตอบ 400 เพราะชน primary key `(key ฟอร์ม, SEQ, PROCID)` ไม่มีการทิ้งข้อมูลที่ขัดแย้งโดยเงียบ ๆ
7. เรียก FormCreateService เพื่อ insert **WEBFORM.FORM และ WEBFORM.FLOW** แล้วใช้ CYEAR2/NRUNNO ที่ได้มา insert **IEDOC.PROC_TSHEADFORM และ IEDOC.PROC_TSDETFORM** ไม่มีการ insert PROC_TSATTFILE ใน endpoint นี้
8. ทั้ง batch อยู่ใน transaction เดียว หากขั้นตอนใดล้มเหลว rollback ทุกฟอร์มในคำขอนั้น ทุก write endpoint ของ IE-TS ใช้ lock บน WEBFORM.FORM ร่วมกัน เพื่อ serialize การตรวจซ้ำและการบันทึกระหว่างคำขอ IE-TS โดยไม่ใช้ LOCK TABLE ข้าม schema ไปยัง IEDOC

PROCID_OLD, PROCID, TP_OLD, TP, TC_OLD และ TC จะ trim ช่องว่าง/tab หัวท้ายก่อน validation และบันทึก โดยไม่แปลงเป็นตัวเลข จึงรักษาค่าเช่น `"0.0062"` ไว้ครบ หาก body มี tab จริงที่ไม่ได้ escape ภายใน string จะยังเป็น JSON ที่ผิด syntax; ให้ลบ tab นั้นหรือส่งด้วย JSON serializer

หากพบ ORA-01031 ให้ตรวจข้อความ error ใหม่ว่าติดการ lock WEBFORM.FORM หรือ access ตารางใด บัญชี webformConnection ต้องมีสิทธิ์บน WEBFORM.FORM/FLOW ตามกระบวนการสร้างฟอร์มเดิม และสิทธิ์ SELECT/INSERT/UPDATE/DELETE บน IEDOC.PROC_TS* สำหรับ CRUD การแก้โค้ดไม่สามารถเพิ่ม database grants ให้บัญชีได้

การตรวจซ้ำของข้อมูลเดิมใช้ TRIM ใน 4 คอลัมน์เพื่อเทียบรหัสที่อาจมีช่องว่างท้าย ค่า CYEAR คือปี master ที่ส่งมา ส่วน CYEAR2 มาจากปีปัจจุบันตาม FormCreateService ผู้เรียกควรเก็บ key ใน response ไว้ใช้อ่าน/แก้ไข/ลบ

### ตัวอย่าง JSON: 2 ชุดฟอร์ม โดยชุดแรกมี 2 DWG และ DWG แรกมี 2 processes

รหัสฟอร์มและพนักงานเป็นตัวอย่าง ต้องเปลี่ยนให้ตรงกับ master TS และพนักงานจริง

```json
[
  {
    "NFRMNO": 4,
    "VORGNO": "051401",
    "CYEAR": "21",
    "REQUEST_BY": "25009",
    "INPUT_BY": "25009",
    "ITEMS": [
      { "DWG": "YA154D379", "GNO": "-01", "LNO": "", "ITEM": "125", "PROCID_OLD": "G1SHE", "TP_OLD": "0.05", "TC_OLD": "0.0062", "PROCID": "G1SHE", "TP": "0.04", "TC": "0.0062" },
	  { "DWG": "YA154D379", "GNO": "-01", "LNO": "", "ITEM": "125", "PROCID_OLD": "G1PR4", "TP_OLD": "0.12", "TC_OLD": "0.0013", "PROCID": "G1PR4", "TP": "0.12", "TC": "0.0033" },
	  { "DWG": "YA188D858", "GNO": "-01", "LNO": "", "ITEM": "125", "PROCID_OLD": "G1LZ3", "TP_OLD": "11", "TC_OLD": "21", "PROCID": "G1LZ3", "TP": "13", "TC": "23" },
      { "DWG": "YA154D379", "GNO": "-02", "LNO": "", "ITEM": "125", "PROCID_OLD": "G1LZ3", "TP_OLD": "0.01", "TC_OLD": "0.0039", "PROCID": "G1LZ3", "TP": "0.1", "TC": "0.0003" }
      
    ]
  },
  {
    "NFRMNO": 4,
    "VORGNO": "051401",
    "CYEAR": "21",
    "REQUEST_BY": "24013",
    "INPUT_BY": "24013",
    "ITEMS": [
      { "DWG": "BS011D184", "GNO": "-01", "LNO": "", "ITEM": "620", "PROCID_OLD": "H8BSA", "TP_OLD": "0.1", "TC_OLD": "0.0038", "PROCID": "H8BSA", "TP": "0.1", "TC": "0.0038" },
	  { "DWG": "BS011D184", "GNO": "-01", "LNO": "", "ITEM": "620", "PROCID_OLD": "H8MK", "TP_OLD": "0.04", "TC_OLD": "0.0071", "PROCID": "H8MK", "TP": "0", "TC": "0" }
    ]
  }
]
```

ถ้าไม่มีข้อมูลซ้ำ ชุดแรกได้ 1 ฟอร์ม มี 2 headers และ 3 details:

| DWG | PROCID_OLD | SEQ | SEQ_PROC |
| --- | --- | --- | --- |
| DWG000001 | P00001 | 001 | 01 |
| DWG000001 | P00002 | 001 | 02 |
| DWG000002 | P00003 | 002 | 01 |

ชุดที่สองได้อีก 1 ฟอร์ม และเริ่ม SEQ=001/SEQ_PROC=01 ใหม่

บันทึก body เป็น `auto-insert-ts.json` แล้วเรียก:

```bash
curl -X POST "{{BASE_URL}}/ieform/ie-ts/auto_insert_ts_process" \
  -H "Content-Type: application/json" \
  --data-binary "@auto-insert-ts.json"
```

### Response

HTTP 201 แม้ทุกชุดจะถูกข้าม ตัวอย่างเมื่อสร้างได้ 1 ชุดและอีก 1 ชุดซ้ำทั้งหมด:

```json
{
  "status": true,
  "total": 2,
  "created": 1,
  "skipped": 1,
  "items": [
    {
      "form": { "NFRMNO": 31, "VORGNO": "051401", "CYEAR": "26", "REQUEST_BY": "12345", "INPUT_BY": "23456" },
      "status": "created",
      "received": 3,
      "inserted": 3,
      "skipped": 0,
      "key": { "NFRMNO": 31, "VORGNO": "051401", "CYEAR": "26", "CYEAR2": "2026", "NRUNNO": 42 }
    },
    {
      "form": { "NFRMNO": 31, "VORGNO": "051401", "CYEAR": "26", "REQUEST_BY": "34567", "INPUT_BY": "23456" },
      "status": "skipped",
      "received": 1,
      "inserted": 0,
      "skipped": 1,
      "key": null
    }
  ]
}
```

`total/created/skipped` ระดับบนเป็น **จำนวนชุดฟอร์มหลังรวม identity** ส่วน `received/inserted/skipped` ใน items เป็น **จำนวน process** ตัวอย่างข้างบนสมมติว่า process ของชุดที่สองมีอยู่แล้วในฐานข้อมูล

เมื่อ retry ด้วยรายการเดิมที่ยังอยู่ในตาราง detail จะถูกข้ามตาม duplicate key 4 ช่องข้างต้น จึงไม่สร้าง Form/Flow ใหม่สำหรับข้อมูลเดิม

## 3. อ่านข้อมูล

```text
GET {{BASE_URL}}/ieform/ie-ts/get_ts_process?NFRMNO=31&VORGNO=051401&CYEAR=26&CYEAR2=2026&NRUNNO=42
```

ต้องส่ง query key ครบทั้ง 5 ช่อง สำเร็จ HTTP 200:

```json
{
  "status": true,
  "key": { "NFRMNO": 31, "VORGNO": "051401", "CYEAR": "26", "CYEAR2": "2026", "NRUNNO": 42 },
  "data": {
    "NFRMNO": 31, "VORGNO": "051401", "CYEAR": "26", "CYEAR2": "2026", "NRUNNO": 42,
    "HEADERS": [{ "NFRMNO": 31, "VORGNO": "051401", "CYEAR": "26", "CYEAR2": "2026", "NRUNNO": 42, "SEQ": "001", "DWGNO": "DWG000001" }],
    "DETAILS": [],
    "FILES": []
  }
}
```

ตัวอย่าง response ย่อคอลัมน์ nullable ของ HEADERS เพื่อให้อ่านง่าย ผลจริงคืนทุกคอลัมน์จาก entity เรียง HEADERS ตาม SEQ, DETAILS ตาม SEQ/PROCID และ FILES ตาม ID

## 4. แก้ไขข้อมูล

```text
PUT {{BASE_URL}}/ieform/ie-ts/update_ts_process
Content-Type: application/json
```

Body ใช้รูปแบบเดียวกับ insert ปกติ **ต้องส่งข้อมูลทั้งหมดที่ต้องการเก็บไว้** ระบบแทนที่ข้อมูล TS ทั้งชุดใน transaction เดียว:

- HEADERS ต้องมีอย่างน้อย 1 รายการ
- รายการเดิมที่ไม่อยู่ใน payload ใหม่จะถูกลบ
- DETAILS หรือ FILES ที่ไม่ส่ง/null/[] จะลบข้อมูลกลุ่มนั้นทั้งหมด
- nullable field ที่ไม่ส่งจะกลับเป็น null เมื่อ insert แถวใหม่
- ไม่แก้ไข key ฟอร์ม, WEBFORM.FORM หรือ WEBFORM.FLOW

สำเร็จ HTTP 200 พร้อม `{ "status": true, "message": "Update TS process successfully", "key": { ... } }` หากไม่พบ TS จะได้ 404 และไม่มีการสร้างข้อมูลใหม่แทน

## 5. ลบข้อมูล

```text
DELETE {{BASE_URL}}/ieform/ie-ts/delete_ts_process?NFRMNO=31&VORGNO=051401&CYEAR=26&CYEAR2=2026&NRUNNO=42
```

ลบทุกแถวของ key นี้ในตาราง TS ทั้ง 3 ตารางเท่านั้น ไม่ลบ Form/Flow และไม่ลบไฟล์จริง สำเร็จ HTTP 200 พร้อม `{ "status": true, "message": "Delete TS process successfully", "key": { ... } }` หากต้องยกเลิกหรือจัดการ workflow ให้ใช้ API ของระบบ Form/Flow ตามกระบวนการเดิม

## เงื่อนไขและข้อผิดพลาด

| HTTP | เหตุผลที่พบบ่อย |
| --- | --- |
| 400 | key ไม่ครบ, ชนิดข้อมูล/ความยาวไม่ถูกต้อง, HEADERS ว่าง, SEQ หรือคู่ SEQ/PROCID หรือ ID ซ้ำ, DETAILS.SEQ ไม่มีใน HEADERS, ส่งเลขฟอร์มเองใน auto, sequence เกินขีดจำกัด, PROCID ใหม่ชนกันในหัวเดียวกัน, TSFLAG ไม่มีใน master |
| 404 | ไม่พบ Form สำหรับ insert/update/delete, ไม่พบ TS สำหรับ get/update/delete หรือ FormCreateService ไม่พบ master/พนักงาน |
| 409 | มี TS ของ key นี้แล้ว หรือชน primary key; insert ไม่ overwrite ข้อมูลเดิม |
| 500 | ฐานข้อมูล/สิทธิ์/schema มีปัญหา หรือสร้าง Form ได้ key ไม่ครบ |

รูปแบบ error ใช้ exception filter ของโปรเจกต์ มี `statusCode`, `timestamp`, `path`, `message`; validation message อาจเป็น array ตาม global ValidationPipe

การติดตั้งต้องมีตารางตาม DDL อยู่แล้ว (`synchronize: false`) และบัญชี `webformConnection` ต้องอ่าน/เขียน `IEDOC.PROC_TS*` ได้ นอกจากนี้ automatic insert ต้องมี FORMMST/FLOWMST และข้อมูลการอนุมัติ/พนักงานพร้อมใช้งาน เช่นเดียวกับการสร้างฟอร์มปกติ ระบบใช้ Oracle SQL สำหรับล็อกเลขฟอร์มตาม Jig ดังนั้น automatic insert ต้องรันบน Oracle ไม่ใช่ MySQL โหมด HOME

VARCHAR2 ใน Oracle อาจจำกัดเป็น byte ตาม DDL/ค่าฐานข้อมูล แม้ข้อความผ่านการตรวจความยาวตัวอักษรแล้ว ข้อความภาษาไทยที่ใกล้ขีดจำกัดยังอาจเกิน byte limit ได้ ควรตรวจ NLS length semantics ของฐานข้อมูลจริง
