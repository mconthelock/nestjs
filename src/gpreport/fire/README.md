# คู่มือ Fire API

เส้นทางหลัก: /fire โดยเติม prefix ของ API ตามการตั้งค่าของแอปพลิเคชันไว้ด้านหน้า

| เมธอด | เส้นทาง | การทำงาน |
| --- | --- | --- |
| GET | /fire | ค้นหาและแบ่งหน้า |
| GET | /fire/:fireCode | อ่านข้อมูลหนึ่งรายการ |
| POST | /fire | เพิ่มข้อมูล |
| PATCH | /fire/:fireCode | แก้ไขเฉพาะฟิลด์ที่ส่งมา |
| DELETE | /fire/:fireCode | ลบข้อมูลถาวร |

ตัวอย่างการค้นหา:

GET /fire?search=ABC&AREA=Factory&STATUS=1&page=1&limit=20

ค้นหาจาก FIRE_CODE, LOCATION, FTYPE, CAPACITY และ AREA โดยไม่แยกตัวพิมพ์เล็ก/ใหญ่
ตัวกรองรายฟิลด์ใช้ชื่อคอลัมน์ตัวพิมพ์ใหญ่ และรวมเงื่อนไขด้วย AND
ส่วน STATUS เปรียบเทียบค่าตรงกัน รวมถึงค่า "0" ด้วย
อักขระ %, _ และ ! ในคำค้นจะถูกค้นหาเป็นข้อความปกติ ไม่ใช่อักขระแทนค่า
ค่าเริ่มต้นคือ page=1 และ limit=20 โดย limit สูงสุดเท่ากับ 100
เรียงข้อมูลตาม FIRE_CODE จากน้อยไปมาก

รูปแบบผลลัพธ์: { data: [...], total: 42, page: 1, limit: 20, totalPages: 3 }

ตัวอย่างข้อมูลที่ส่งใน body ของ POST:

```json
{
  "FIRE_CODE": "F001",
  "LOCATION": "Building A",
  "FTYPE": "CO2",
  "CAPACITY": "10 lbs",
  "AREA": "Factory",
  "STATUS": "1"
}
```

ตัวอย่าง body ของ PATCH: { "LOCATION": "Building B", "STATUS": "0" }

ไม่สามารถเปลี่ยน FIRE_CODE ได้ ฟิลด์ที่ไม่ได้ส่งมาจะคงค่าเดิม
ส่ง null เพื่อล้างค่าของฟิลด์ โดย Oracle จะเก็บข้อความว่างเป็น NULL เช่นกัน
STATUS รับข้อความยาวไม่เกินหนึ่งตัวอักษรตามโครงสร้างตารางที่กำหนด

ข้อผิดพลาด: 400 เมื่อ body/query ไม่ถูกต้องหรือไม่มีฟิลด์ให้แก้ไข,
404 เมื่อไม่พบรายการ และ 409 เมื่อ FIRE_CODE ซ้ำ

ผลลัพธ์เมื่อลบสำเร็จ:
{ message: "FIRE_ITEM_DELETED", FIRE_CODE: "F001" }

## การใช้งานร่วมกับหน้า Safety Fire

เส้นทาง CRUD ด้านบนยังเรียกใช้ได้ตามเดิม
หน้า Safety ใช้เส้นทางเพิ่มเติมต่อไปนี้เพื่อคงพฤติกรรมการทำงานเดิม:

| เมธอด | เส้นทาง | การทำงาน |
| --- | --- | --- |
| GET | /fire/items | อ่าน master ทั้งรายการที่ใช้งานและไม่ใช้งาน เรียงตาม FIRE_CODE และคืนค่า `{items: [...]}` |
| POST | /fire/save | เพิ่มหรือแก้ไขด้วยฟิลด์ของหน้าจอเดิม โดยส่ง `original_code` เพิ่มได้เมื่อแก้ไข |
| POST | /fire/deactivate | เปลี่ยน STATUS เป็น `0` โดยไม่ลบข้อมูลถาวรจากหน้าจอ |
| POST | /fire/inspection/check | รับ multipart ฟิลด์ `month` รูปแบบ YYYY-MM และไฟล์ `excel` ชนิด .xlsx หรือ .xls |

การบันทึกรับได้ทั้ง multipart form data และ JSON
ข้อความจะถูกตัดช่องว่างหัวท้าย โดยต้องระบุ FIRE_CODE และห้ามเปลี่ยนรหัสขณะแก้ไข
ตรวจความยาว UTF-8 ตามจำนวนไบต์ของ Oracle: FIRE_CODE ไม่เกิน 20 ไบต์
และ LOCATION, FTYPE, CAPACITY, AREA ไม่เกิน 100 ไบต์ ส่วน STATUS ต้องเป็น `0` หรือ `1`
รหัสที่มีสถานะไม่ใช้งานยังถือเป็นรหัสซ้ำ
ผลลัพธ์ของ save/deactivate มี `message` ภาษาไทยสำหรับแสดงในหน้า Safety

การตรวจสอบรับไฟล์ขนาดไม่เกิน 10 MB สูงสุด 20 ชีต และ 50,000 แถวต่อชีต
อ่านทุกชีตตั้งแต่แถวที่ 2 โดยอ่านวันที่จากคอลัมน์ G และรหัสจาก J ถึง BE เท่านั้น
รองรับวันที่แบบเลขลำดับของ Excel รวมถึงตัวเลขที่เก็บเป็นข้อความ และรูปแบบ m/d/yyyy
ใช้รหัสในวงเล็บคู่สุดท้าย ตัดอักขระช่องว่าง Unicode และนับรหัสซ้ำเพียงครั้งเดียว
เปรียบเทียบแบบแยกตัวพิมพ์เล็ก/ใหญ่กับ master ที่มีสถานะใช้งานเท่านั้น
ผลลัพธ์คงชื่อฟิลด์รายงานเดิมดังนี้:
`month`, `filename`, `master_count`, `matched_rows`, `found_count`, `matched_count`,
`missing`, `unexpected`, `invalid_cells`, `invalid_dates`, `complete`

ไม่ต้องเปลี่ยนโครงสร้างฐานข้อมูล ให้ deploy API ก่อน bundle ของหน้า Safety
เบราว์เซอร์ใช้ APP_API และไม่ส่งคำขอ CRUD/ตรวจสอบไปยัง PHP controller แล้ว
ส่วนอ่านไฟล์/model PHP และสคริปต์ต้นฉบับเดิมถูกนำออกจาก Safety
หลังตรวจว่าหน้าจอที่ปรับแล้วไม่มีการอ้างอิงถึงส่วนเหล่านั้น

## CRUD ผลการตรวจ Fire: HEAD / DETAIL

API ส่วนนี้อ่านและเขียนข้อมูลใน `GPREPORT.FIRE_CHECK_HEAD`
และ `GPREPORT.FIRE_CHECK_DETAIL` ผ่าน `gpreportConnection`
เส้นทาง master และเปรียบเทียบ Excel เดิมยังทำงานเหมือนเดิม
การบันทึกผลตรวจไม่ใช่การ submit webform ไม่ได้สร้างเลขฟอร์ม
และไม่ได้บันทึกผลจาก `/fire/inspection/check` ให้อัตโนมัติ

หน้าที่ของไฟล์หลัก:

- `fire.controller.ts`, `fire.service.ts`, `fire.repository.ts` ดูแล master และการตรวจ Excel เดิม
- `fire-check-head.controller.ts`, `fire-check-head.service.ts`, `fire-check-head.repository.ts` ดูแล CRUD ของ HEAD
- `fire-check-detail.controller.ts`, `fire-check-detail.service.ts`, `fire-check-detail.repository.ts` ดูแล CRUD ของ DETAIL
- `fire-check.utils.ts` รวมการตรวจ DTO, การเติมช่องว่าง CHAR, การตรวจ pagination และการแปลงข้อผิดพลาดที่ใช้ร่วมกัน
- `fire.module.ts` ลงทะเบียน entity, Controller, Service และ Repository ของทั้งโมดูล
- `dto/` เก็บ DTO สำหรับรับข้อมูล

Repository แยกตามตาราง โดยแต่ละตัวสืบทอด `BaseRepository` และใช้ `gpreportConnection`
Head Service ใช้ Detail Repository เพื่อตรวจรายการลูกก่อนลบ HEAD
Detail Service ใช้ Head Repository เพื่อตรวจและล็อก HEAD ก่อนเพิ่ม DETAIL
ทั้งสองกรณียังคงใช้ transaction context เดียวกัน ไม่มีการเรียกวนระหว่าง Service

ข้อมูลกำกับ entity ตรงกับ DDL ที่กำหนด โดยไม่มีการรัน migration
หรือปรับโครงสร้างฐานข้อมูลอัตโนมัติ

### วิธีเรียกผ่าน HTTP

`{{BASE_URL}}` คือ URL หลักของ API ที่ใช้อยู่ โดยรวม prefix ของระบบที่ deploy แล้ว
สำหรับ POST/PATCH ให้ส่ง header `Content-Type: application/json`
Fire controller ไม่ได้เพิ่ม authentication guard
จึงใช้การยืนยันตัวตนและสิทธิ์เข้าถึงตามที่แอปพลิเคชันหลักกำหนดไว้

ในตารางด้านล่าง กำหนดให้ `H` แทนเส้นทาง
`/fire/check-heads/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO`
และ `D` แทนเส้นทาง
`/fire/check-details/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO/:ID/:FIRE_CODE`
ให้ทำ URL encoding ค่าข้อความแต่ละส่วนของ path ก่อนส่ง

| เมธอด | URL ต่อจาก {{BASE_URL}} | การทำงาน |
| --- | --- | --- |
| GET | /fire/check-heads | ค้นหา HEAD พร้อมแบ่งหน้า |
| GET | H | อ่าน HEAD หนึ่งรายการด้วย Primary Key ครบ 5 คอลัมน์ |
| POST | /fire/check-heads | เพิ่ม HEAD |
| PATCH | H | แก้ไขได้เฉพาะ AREA, FMONTH และ FYEAR |
| DELETE | H | ลบ HEAD ที่ไม่มี DETAIL |
| GET | /fire/check-details | ค้นหา DETAIL พร้อมแบ่งหน้า |
| GET | D | อ่าน DETAIL หนึ่งรายการด้วย Primary Key ครบ 7 คอลัมน์ |
| POST | /fire/check-details | เพิ่ม DETAIL ภายใต้ HEAD ที่มีอยู่ |
| PATCH | D | แก้ไขได้เฉพาะฟิลด์ผลการตรวจ |
| DELETE | D | ลบ DETAIL หนึ่งรายการถาวร |

ฟิลด์ key ของ HEAD ต้องระบุใน POST และ path ที่อ้างถึงข้อมูลหนึ่งรายการ:

| ฟิลด์ | ชนิดข้อมูล JSON | บังคับ | ข้อจำกัดฐานข้อมูล / ความหมาย |
| --- | --- | --- | --- |
| NFRMNO | integer | ใช่ | NUMBER(3), -999..999, เลขฟอร์ม |
| VORGNO | string | ใช่ | VARCHAR2(6), รหัสหน่วยงาน |
| CYEAR | string | ใช่ | CHAR(2), ปีที่เป็นส่วนหนึ่งของ key ฟอร์ม |
| CYEAR2 | string | ใช่ | CHAR(4), ปีที่เป็นส่วนหนึ่งของ key ฟอร์ม |
| NRUNNO | integer | ใช่ | NUMBER(6), -999999..999999, เลขรัน |
| AREA | string | เมื่อ POST HEAD | VARCHAR2(100), พื้นที่ตรวจ แก้ไขได้ |
| FMONTH | string | เมื่อ POST HEAD | VARCHAR2(2), เดือนตรวจ แก้ไขได้ |
| FYEAR | string | เมื่อ POST HEAD | VARCHAR2(4), ปีตรวจ แก้ไขได้ |

ความยาวข้อความทั้งในตารางด้านบนและด้านล่างตรวจเป็นจำนวนไบต์ UTF-8
ควบคู่กับจำนวนตัวอักษรที่ DTO กำหนด
ข้อความที่บังคับกรอกต้องไม่ว่างและต้องไม่เป็นช่องว่างทั้งหมด
ระบบไม่ตัดช่องว่างหัวท้ายหรือแปลงตัวพิมพ์เล็ก/ใหญ่

CYEAR/CYEAR2 จะถูกเติมช่องว่างท้ายข้อความให้ครบความกว้างของ CHAR คือ 2/4 ไบต์
ก่อนบันทึกและใช้เป็นเงื่อนไขเปรียบเทียบ เพื่อให้ตรงกับการจัดเก็บของ Oracle
และการเปรียบเทียบกับค่าที่ bind แบบ VARCHAR2
จึงรองรับค่า CHAR ที่ส่งมาสั้นกว่าความยาวคอลัมน์ได้เหมือนกันทุกขั้นตอน:
เพิ่ม อ่าน ค้นหา แก้ไข ลบ และตรวจหา HEAD ของรายการลูก
ค่า CHAR ที่คืนมาอาจมีช่องว่างท้ายข้อความ
รหัสและปียังคงเป็นข้อความเพื่อรักษาเลขศูนย์ด้านหน้า

FMONTH/FYEAR ตรวจเป็นข้อความตามความยาวใน DDL
โดยไม่ได้เพิ่มกฎตรวจปฏิทินหรือสถานะทางธุรกิจนอกเหนือจากโครงสร้างตาราง

POST ของ DETAIL ต้องส่ง key ทั้ง 5 ฟิลด์ของ HEAD พร้อม ID และ FIRE_CODE:

| ฟิลด์ | ชนิดข้อมูล JSON | บังคับ | ข้อจำกัดฐานข้อมูล / ความหมาย |
| --- | --- | --- | --- |
| ID | integer | ใช่ | NUMBER(3), -999..999, ส่วนหนึ่งของ Primary Key ของ DETAIL |
| FIRE_CODE | string | ใช่ | VARCHAR2(20), ส่วนหนึ่งของ Primary Key ของ DETAIL |
| GAGE | string หรือ null | ไม่ | VARCHAR2(20), ผลการตรวจ |
| WEIGHT | number หรือ null | ไม่ | NUMBER(6,2), -9999.99..9999.99, ทศนิยมไม่เกิน 2 ตำแหน่ง |
| PIN | string หรือ null | ไม่ | VARCHAR2(20), ผลการตรวจ |
| HOSE | string หรือ null | ไม่ | VARCHAR2(20), ผลการตรวจ |
| CLEAN | string หรือ null | ไม่ | VARCHAR2(20), ผลการตรวจ |
| DETAIL | string หรือ null | ไม่ | VARCHAR2(500), หมายเหตุ |
| CHECK_DATE | string รูปแบบ ISO 8601 หรือ null | ไม่ | DATE, แปลงเป็น JavaScript Date ก่อนบันทึก |

WEIGHT ต้องส่งเป็นตัวเลข JSON ไม่ใช่ข้อความตัวเลข
ส่วน path/query ที่เป็นจำนวนเต็มสามารถส่งเป็นข้อความจำนวนเต็มได้
ฟิลด์ key ที่บังคับของ HEAD/DETAIL และ AREA/FMONTH/FYEAR ไม่รับ null รวมถึงเมื่อ PATCH

Oracle เก็บข้อความว่างเป็น NULL จึงล้างค่าฟิลด์ผลตรวจที่เป็นข้อความและไม่บังคับ
ด้วย `null` หรือข้อความว่างได้ ส่วน CHECK_DATE และ WEIGHT ให้ส่ง `null` เพื่อล้างค่า
ชนิด DATE ไม่เก็บเขตเวลา จึงควรใช้รูปแบบเขตเวลาตามมาตรฐานเดิมของแอปพลิเคชัน
เมื่อส่งวันที่และเวลา

### การค้นหา

HEAD รองรับตัวกรองแบบค่าตรงกันสำหรับทั้ง 8 ฟิลด์ โดยไม่บังคับให้ส่งทุกฟิลด์
DETAIL รองรับตัวกรองแบบค่าตรงกันสำหรับ key ทั้ง 7 ฟิลด์ โดยไม่บังคับให้ส่งทุกฟิลด์
รวมเงื่อนไขด้วย AND และไม่ได้ค้นหาแบบบางส่วนของข้อความ
`page` เริ่มต้นที่ 1 และ `limit` เริ่มต้นที่ 20
โดย page ต้องไม่น้อยกว่า 1 และ limit อยู่ในช่วง 1..100
เรียงข้อมูลตาม Primary Key ทุกคอลัมน์จากน้อยไปมาก เพื่อให้ลำดับการแบ่งหน้าคงที่

ตัวอย่าง:

```text
GET {{BASE_URL}}/fire/check-heads?AREA=Factory&FMONTH=11&FYEAR=2026&page=1&limit=20
GET {{BASE_URL}}/fire/check-details?NFRMNO=1&VORGNO=000001&CYEAR=26&CYEAR2=2026&NRUNNO=1&page=1&limit=20
```

ทั้งสองเส้นทางคืนค่า `{ "data": [...], "total": 1, "page": 1, "limit": 20, "totalPages": 1 }`
หากค้นหาไม่พบจะคืน HTTP 200 พร้อม `data: []`, `total: 0` และ `totalPages: 0`
การ GET หนึ่งรายการจะคืน entity ที่จัดเก็บไว้ หรือ HTTP 404 เมื่อไม่พบ

### ตัวอย่างการเพิ่มและแก้ไข

```text
POST {{BASE_URL}}/fire/check-heads
```

```json
{
  "NFRMNO": 1,
  "VORGNO": "000001",
  "CYEAR": "26",
  "CYEAR2": "2026",
  "NRUNNO": 1,
  "AREA": "Factory",
  "FMONTH": "11",
  "FYEAR": "2026"
}
```

เมื่อเพิ่มสำเร็จจะคืน HTTP 201 พร้อม HEAD ที่บันทึก โดยใช้ชื่อฟิลด์เดียวกับตัวอย่าง

```text
POST {{BASE_URL}}/fire/check-details
```

```json
{
  "NFRMNO": 1,
  "VORGNO": "000001",
  "CYEAR": "26",
  "CYEAR2": "2026",
  "NRUNNO": 1,
  "ID": 1,
  "FIRE_CODE": "F001",
  "GAGE": "OK",
  "WEIGHT": 12.5,
  "PIN": "OK",
  "HOSE": "OK",
  "CLEAN": "OK",
  "DETAIL": null,
  "CHECK_DATE": "2026-11-13"
}
```

เมื่อเพิ่มสำเร็จจะคืน HTTP 201 พร้อม DETAIL ที่บันทึก
ฟิลด์ที่รับ null ได้และไม่ได้ส่งมาจะใช้ค่าเริ่มต้นของฐานข้อมูล
ซึ่ง DDL ที่กำหนดมีค่าเริ่มต้นเป็น NULL
NestJS จะแปลง CHECK_DATE ในผลลัพธ์เป็นข้อความวันที่และเวลา

```text
PATCH {{BASE_URL}}/fire/check-heads/1/000001/26/2026/1
```

```json
{ "AREA": "Factory B", "FMONTH": "12" }
```

```text
PATCH {{BASE_URL}}/fire/check-details/1/000001/26/2026/1/1/F001
```

```json
{ "GAGE": "NG", "WEIGHT": null, "DETAIL": "Replace item", "CHECK_DATE": null }
```

เมื่อแก้ไขสำเร็จจะคืน HTTP 200 พร้อม entity หลังแก้ไข
ฟิลด์ที่ไม่ได้ส่งมาจะคงค่าเดิม และไม่สามารถเปลี่ยนฟิลด์ Primary Key ได้
ระบบตรวจข้อมูลจะตัดฟิลด์ที่ไม่รู้จักและฟิลด์ key ที่ส่งมาใน body ออก
หาก PATCH ไม่มีฟิลด์ที่อนุญาตให้แก้ไข จะคืน HTTP 400

```text
DELETE {{BASE_URL}}/fire/check-details/1/000001/26/2026/1/1/F001
```

ตัวอย่างผลลัพธ์ HTTP 200:

```json
{
  "message": "FIRE_CHECK_DETAIL_DELETED",
  "NFRMNO": 1,
  "VORGNO": "000001",
  "CYEAR": "26",
  "CYEAR2": "2026",
  "NRUNNO": 1,
  "ID": 1,
  "FIRE_CODE": "F001"
}
```

หลังลบรายการลูกทั้งหมดแล้ว จึงเรียก
`DELETE {{BASE_URL}}/fire/check-heads/1/000001/26/2026/1` ได้
ผลลัพธ์จะมี key ทั้ง 5 ฟิลด์ของ HEAD และ `message: "FIRE_CHECK_HEAD_DELETED"`

### กฎการทำงาน Transaction และข้อผิดพลาด

- ผู้เรียกต้องส่ง NFRMNO/NRUNNO/ID เอง ไม่มีการใช้ sequence, MAX+1 หรือสร้างเลขอัตโนมัติ
- การเพิ่มข้อมูลใช้ INSERT จึงไม่เขียนทับข้อมูลเดิมเมื่อ key ซ้ำ
- HEAD ตรวจข้อมูลซ้ำด้วย Primary Key ทั้ง 5 คอลัมน์ และ
  `UK_FIRE_CHECK_AREA_MONTH (AREA, FMONTH, FYEAR)` รวมถึงเมื่อแก้ไขข้อมูล
- DETAIL ตรวจข้อมูลซ้ำด้วย Primary Key ทั้ง 7 คอลัมน์
  ID หรือ FIRE_CODE เพียงฟิลด์เดียวไม่ได้ถูกกำหนดให้ไม่ซ้ำ
  ไม่ได้เพิ่มกฎว่าต้องมีรหัสอยู่ใน master เนื่องจาก DDL ไม่ได้กำหนดความสัมพันธ์นี้
- การเพิ่ม DETAIL ต้องมี HEAD ที่มี key ทั้ง 5 ฟิลด์ตรงกันอยู่ก่อน
- หาก HEAD ยังมี DETAIL จะลบไม่ได้และคืน 409 โดยไม่ลบรายการลูกอัตโนมัติ
- การเพิ่ม DETAIL และลบ HEAD ใช้ transaction context ของผู้เรียก
  หากยังไม่มี transaction ที่ทำงานอยู่ Repository จะเปิด transaction ผ่าน manager เดิม
  แล้วผูก manager นั้นเข้ากับ transaction context ของระบบ
- ทั้งสอง operation ล็อกแถว HEAD เดียวกันด้วย row-level pessimistic write lock
  จนกว่าจะ commit/rollback เพื่อป้องกันการเพิ่ม DETAIL และลบ HEAD ทำงานชนกันผ่าน API เหล่านี้
  หากผิดพลาดจะ rollback transaction ที่เปิดใน operation นั้น
  ถ้าใช้ transaction ของผู้เรียกภายนอก ผู้เรียกเป็นผู้ควบคุม commit/rollback
- แต่ละคำขอเปลี่ยนข้อมูลหนึ่งรายการ ไม่มีการเพิ่มแบบ batch หรือขั้นตอน submit
- DDL ไม่ได้กำหนด foreign key การเขียนผ่านโค้ดภายนอกหรือ SQL โดยตรง
  ต้องรักษาความสัมพันธ์ HEAD/DETAIL เอง เพราะ API ไม่สามารถบังคับผู้เขียนเหล่านั้น
  ได้โดยไม่เปลี่ยนโครงสร้างฐานข้อมูล

| HTTP | ข้อความ | ความหมาย |
| --- | --- | --- |
| 400 | ข้อความตรวจข้อมูล / INVALID_FIRE_CHECK_INPUT | ชนิดข้อมูลหรือความยาวไม่ถูกต้อง หรือ key ไม่ครบ |
| 400 | NO_FIELDS_TO_UPDATE | ไม่มีฟิลด์ที่อนุญาตให้แก้ไขส่งมา |
| 404 | FIRE_CHECK_HEAD_NOT_FOUND | ไม่พบ HEAD รวมถึง HEAD ของ DETAIL ที่กำลังเพิ่ม |
| 404 | FIRE_CHECK_DETAIL_NOT_FOUND | ไม่พบ DETAIL ตาม key ที่ระบุ |
| 409 | FIRE_CHECK_HEAD_OR_AREA_MONTH_ALREADY_EXISTS | key ของ HEAD หรือพื้นที่/เดือน/ปีซ้ำเมื่อเพิ่ม |
| 409 | FIRE_CHECK_AREA_MONTH_ALREADY_EXISTS | พื้นที่/เดือน/ปีซ้ำเมื่อแก้ไข HEAD |
| 409 | FIRE_CHECK_DETAIL_ALREADY_EXISTS | key ของ DETAIL ทั้ง 7 คอลัมน์ซ้ำ |
| 409 | FIRE_CHECK_HEAD_HAS_DETAILS | ต้องลบรายการลูกก่อนลบ HEAD |
| 500 | FIRE_CHECK_DATABASE_ERROR | เกิดข้อผิดพลาดในการ query ฐานข้อมูล โดยไม่คืน SQL |

ข้อผิดพลาดในระบบจริงยังใช้รูปแบบ AllExceptionsFilter ของแอปพลิเคชัน เช่น:

```json
{
  "statusCode": 404,
  "timestamp": "2026-11-13T00:00:00.000Z",
  "path": "/fire/check-heads/1/000001/26/2026/1",
  "message": "FIRE_CHECK_HEAD_NOT_FOUND"
}
```

ตัวอย่างเหล่านี้ใช้แสดงรูปแบบการเรียกและผลลัพธ์ ไม่ใช่ข้อมูลตอบกลับที่เก็บจาก Oracle จริง

### การเรียกจาก Service อื่น

ให้ import `FireModule` ในโมดูลของผู้เรียก แล้ว inject `FireCheckHeadService` สำหรับ HEAD
และ `FireCheckDetailService` สำหรับ DETAIL ส่วน master/Excel ยังคงใช้ `FireService`:

```typescript
constructor(
    private readonly headService: FireCheckHeadService,
    private readonly detailService: FireCheckDetailService,
) {}

const key = { NFRMNO: 1, VORGNO: '000001', CYEAR: '26', CYEAR2: '2026', NRUNNO: 1 };
const head = await this.headService.findCheckHead(key);
const result = await this.detailService.searchCheckDetails({ ...key, page: 1, limit: 20 });
const updated = await this.headService.updateCheckHead(key, { AREA: 'Factory B' });
```

เมธอดของ `FireCheckHeadService`: searchCheckHeads(query), findCheckHead(key), createCheckHead(dto),
updateCheckHead(key, dto), removeCheckHead(key)

เมธอดของ `FireCheckDetailService`: searchCheckDetails(query), findCheckDetail(key), createCheckDetail(dto),
updateCheckDetail(key, dto), removeCheckDetail(key)

เมธอด HEAD/DETAIL ที่เดิมอยู่ใน `FireService` ถูกย้ายไป Service ของแต่ละตารางตามรายการข้างต้น
ให้ผู้เรียกภายในเปลี่ยน Service ที่ inject และใช้ชื่อเมธอดเดิม ส่วน URL และรูปแบบ HTTP ไม่เปลี่ยน

ชนิด argument ใช้คลาสที่ export ใน `dto/` ให้ตรงกับเมธอด
แต่ละเมธอดคืน Promise ของ entity, ผลลัพธ์แบ่งหน้า หรือข้อความยืนยันการลบตามที่อธิบายข้างต้น

เมธอดใหม่ตรวจข้อมูลและคัดเฉพาะฟิลด์ที่ DTO อนุญาตที่ชั้น Service ด้วย
การเรียกโดยตรงจึงยังต้องผ่านการตรวจ key, การรับ null, ความยาว และการแบ่งหน้า
ไม่ต้องสร้าง Express request/response หรือส่ง client IP
การทำงานของ Repository ใช้ transaction context เดิมของ BaseRepository
หากต้องการให้การทำงานทั้งหมดของผู้เรียก rollback
อย่าจับข้อผิดพลาดภายใน transaction ภายนอกแล้วปล่อยให้ทำงานต่อจน commit
