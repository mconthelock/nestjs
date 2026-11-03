# คู่มือ PI Line API

ตรวจโค้ดวันที่ 22/10/2026 ครอบคลุมโฟลเดอร์ `src/workload/piline*` รวม Production Event, NG, ไฟล์, Master, Reject Notice และ Bending ตัวอย่างเป็นข้อมูลสมมุติ ต้องใช้ ID/รหัสพนักงาน/เลขฟอร์มจริงที่มีในระบบ

## 1. เริ่มต้นและเลือก API

`{{BASE_URL}}` คือ URL API ที่ deploy จริง เช่น `http://localhost:3000` ใช้ข้อมูลยืนยันตัวตนตาม gateway/server ที่ใช้งาน

| งาน | API ที่ใช้ |
|---|---|
| บันทึกจากหน้า Production Event | POST /workload/piline_event_record/input แบบ multipart |
| แก้ไขจากหน้าจอพร้อมไฟล์ | PATCH /workload/piline_event_record/input/:number |
| อ่านรายการทั้งหมด/รายการเพื่อออก RN | GET /workload/piline_event_record หรือ /issue |
| จัดการ master พร้อมออก ID | /workload/piline_master_management/:kind |
| CRUD รายตารางโดยระบุ key เอง | /workload/piline_* |
| เตรียมและบันทึก Reject Notice | /workload/piline_issue/request |
| งาน Bending | /workload/piline_bending_main และ /piline_bending_att |

JSON ใช้ Content-Type: application/json ส่วน multipart ให้ Postman/browser กำหนด boundary เอง ตัวเลขส่งเป็น JSON number สถานะ '0'/'1' เป็น string

CRUD รายตารางไม่ได้ทำกระบวนการเดียวกับ input API: เช่น ไม่ออกเลข PI อัตโนมัติและไม่รวม Event/NG/ไฟล์ใน transaction เดียว จึงควรเลือก endpoint ให้ตรงงาน

## 2. อ่านรายการและ dropdown

ทุก GET ด้านล่างไม่ต้องส่ง body:

| Path หลัง {{BASE_URL}} | หน้าที่ |
|---|---|
| /workload/piline_event_record | รายการพร้อม NG, ATT, CREATE_BY_NAME/UPDATE_BY_NAME และข้อมูลชิ้นงาน |
| /workload/piline_event_record/issue | เฉพาะ IS_NG='1' และ RECORD_STATUS='ACTIVE' เพื่อออก RN |
| /workload/piline_location_mst | Location |
| /workload/piline_cause_mst | Cause |
| /workload/piline_problem_mst | Problem |
| /workload/piline_event_mst | ประเภท Event |
| /workload/piline_initial_mst | Initial action |
| /workload/piline_mapping_mst | Mapping Location/Cause/Problem/Event |
| /workload/piline_section_mst | Section พร้อม SSEC สำหรับแสดงชื่อ |

รายการ Event ซ่อน RECORD_STATUS='DELETE' แต่แสดงรายการเก่าที่ status เป็น NULL เรียงวัน/เลขรันจากใหม่ไปเก่า ไม่จำกัด 200 แถวใน repository ปัจจุบัน Response แบบ `{ "status": true, "data": [...] }`

Master GET ไม่ควรสันนิษฐานว่ากรอง ACTIVE ทุกตัว ฝั่ง input จะตรวจ master/mapping ที่ใช้งานได้อีกครั้งตอนบันทึก

## 3. สร้าง Event จากหน้าจอ (แนะนำ)

```http
POST {{BASE_URL}}/workload/piline_event_record/input
Content-Type: multipart/form-data
```

ใน Postman เลือก Body → form-data:

| Key | ชนิด | ค่า |
|---|---|---|
| payload | Text | JSON ด้านล่างทั้งก้อน |
| eventFiles | File | ไฟล์เหตุการณ์ ใส่หลายแถวชื่อเดียวกันได้ |
| ngFiles | File | ไฟล์ NG ใช้เมื่อ IS_NG='1' |

ตัวอย่าง payload ไม่มี NG:

```json
{
  "EVENT_DATE":"2026-10-22","SHIFT":"Day",
  "START_TIME":"08:00","END_TIME":"08:30",
  "LOCATION_ID":1,"SSECCODE":"051403",
  "CAUSE_ID":1,"PROBLEM_ID":1,"INITIAL_ID":1,
  "DETAIL":"Machine stopped for adjustment",
  "IS_NG":"0","REMARK":"Restarted normally","CREATE_BY":"12345"
}
```

ทุกช่องด้านบนบังคับยกเว้น REMARK; master ID ต้องมีจริงและ mapping ต้องตรงกัน

| ช่อง | ข้อกำหนด |
|---|---|
| EVENT_DATE | YYYY-MM-DD |
| SHIFT | Day หรือ Night |
| START_TIME / END_TIME | HH:mm รองรับช่วงข้ามเที่ยงคืนใน service |
| LOCATION_ID/CAUSE_ID/PROBLEM_ID/INITIAL_ID | integer ของ master |
| SSECCODE / CREATE_BY | string ไม่ว่าง ไม่เกิน 6 ตัว |
| DETAIL | string ไม่ว่าง ไม่เกิน 1000 ตัว |
| IS_NG | '0' หรือ '1' |
| REMARK | optional ไม่เกิน 1000 ตัว |

กรณีมี NG เปลี่ยน IS_NG เป็น '1' และเพิ่ม object นี้:

```json
{
  "NG":{
    "ID_TAG":"12345678901","QTY":2,
    "MAT_LOT":"LOT001","MAT_NO":"MAT001","REMARK_NG":"Surface scratch"
  }
}
```

NG: ID_TAG ไม่ว่าง ≤20 ตัว, QTY integer 1–999, MAT_NO ไม่ว่าง ≤20 ตัว; MAT_LOT optional ≤20 ตัว และ REMARK_NG optional ≤1000 ตัว ถ้า IS_NG='0' ห้ามส่ง NG/ngFiles

**ไม่ส่ง PILINE_NO, RUN_NO, CREATE_DATE, RECORD_STATUS หรือ reference RN** เข้า input API ระบบออกเลข `PIYYMMDD###` เช่น PI261022001 เองจาก EVENT_DATE และ RUN_NO ของวันนั้น แล้วตั้ง ACTIVE

บันทึก Event + NG + ATT ใน transaction เดียว จำกัด 999 รายการต่อวัน เมื่อหนึ่ง request สำเร็จจึงตอบ:

```json
{
  "status":true,
  "data":{
    "PILINE_NO":"PI261022001","RUN_NO":1,
    "EVENT_DATE":"2026-10-22","RECORD_STATUS":"ACTIVE","attachments":[]
  }
}
```

ตัวอย่างย่อ data ของจริงมีฟิลด์อื่นด้วย และวันที่จาก ORM อาจ serialize เป็น ISO datetime

ตัวอย่าง JavaScript:

```javascript
const body = new FormData();
body.append('payload', JSON.stringify(payload));
for (const file of eventFiles) body.append('eventFiles', file);
const response = await fetch(`${baseUrl}/workload/piline_event_record/input`, {
  method: 'POST', body
});
const result = await response.json();
```

ห้ามตั้ง Content-Type application/json ให้ request นี้; browser จะใส่ multipart boundary ให้

## 4. แก้ไข Event และไฟล์

```http
PATCH {{BASE_URL}}/workload/piline_event_record/input/PI261022001
```

ส่ง multipart แบบเดียวกับ create และส่ง payload **ครบชุด** แม้ใช้ PATCH ไม่ใช่ส่งเฉพาะช่องที่เปลี่ยน

- EVENT_DATE ต้องเป็นวันเดิม; PILINE_NO/RUN_NO/ผู้สร้างเดิม/reference คงเดิม
- CREATE_BY ใน payload คือผู้แก้ไขปัจจุบัน service นำไปบันทึก UPDATE_BY
- รายการ DELETE หรือ NG ที่เป็น QC_REJECT แก้ผ่าน input ไม่ได้
- ไฟล์เดิมยังอยู่ แนบใหม่เพิ่มจากเลข SEQ ต่อไปของ TYPEFILE นั้น
- ลบไฟล์เดิมด้วย DELETE_FILES ใน payload:

```json
{"DELETE_FILES":[{"TYPEFILE":"EVT","SEQ":1},{"TYPEFILE":"NG","SEQ":1}]}
```

นำส่วนนี้ไปรวมกับ payload เต็ม ใช้ได้เฉพาะ edit ต้องเป็นไฟล์ที่มีจริงในรายการนั้น ลบ metadata ใน transaction และลบไฟล์จริงหลัง commit

ไฟล์รวมไม่เกิน 10 ไฟล์ ไฟล์ละไม่เกิน 5 MB ชนิด PDF/JPEG/PNG/GIF/WEBP/HEIC พร้อมตรวจ signature ฝั่ง server

ที่เก็บใช้ PILINE_FILE_PATH ก่อน fallback เดิม โครงสร้าง `<root>/<PILINE_NO>/<ชื่อไฟล์>` เลข SEQ แยก EVT และ NG ไฟล์จริงมีชื่อที่ระบบสร้างเพื่อไม่ชนกัน

ดูไฟล์:

```http
GET {{BASE_URL}}/workload/piline_event_record/input/PI261022001/files/EVT/1
```

คืน binary ไม่ใช่ JSON; ไม่พบไฟล์ 404 หาก commit ไม่ทราบผลอาจได้ 503 ให้ตรวจรายการก่อนส่งซ้ำ

## 5. ค้น ID Tag / Material

```http
GET {{BASE_URL}}/workload/piline_event_record/idtag/12345678901
```

รับ ID Tag 11 ตัวหลังตัด whitespace ค้น F110KP แล้วอ่าน Material Code ผ่าน Oracle DB Link PILINE_PIIS_LINK

```json
{
  "status":true,
  "data":{"F11K01":"12345678901","F11K04":"ORDER-001"},
  "materialCodes":["MAT001","MAT002"]
}
```

ตัวอย่างย่อ data จริงเลือก F11K01/04/05/06/11/15/16/18; ไม่พบ ID Tag 404, DB Link ใช้ไม่ได้ 503, ไม่มี Material คืน [] เลือก materialCodes ไปส่ง MAT_NO

## 6. Master Management (ออก ID ให้)

| Method | URL | Body |
|---|---|---|
| GET | /workload/piline_master_management/:kind | ไม่มี |
| POST | /workload/piline_master_management/:kind | ข้อมูลครบตาม kind รวม STATUS |
| PATCH | /workload/piline_master_management/:kind/:id | ข้อมูลครบตาม kind รวม STATUS |
| DELETE | /workload/piline_master_management/:kind/:id | ไม่มี |

kind และตัวอย่าง body (ใช้ได้ทั้ง POST/PATCH; PATCH ต้องส่งครบ):

| kind | ตัวอย่าง JSON |
|---|---|
| location | `{"LOCATION_NAME":"Line A","STATUS":"1"}` |
| cause | `{"CAUSE_NAME":"Machine","STATUS":"1"}` |
| problem | `{"PROBLEM_NAME":"Stop","STATUS":"1"}` |
| initial | `{"INITIAL_DETAIL":"Adjust machine","STATUS":"1"}` |
| event | `{"MAIN_CATEGORY":"Machine","EVENT_TYPE":"Stop","PRODUCTION_IMPACT":"Delay","STATUS":"1"}` |
| mapping | `{"LOCATION_ID":1,"CAUSE_ID":1,"PROBLEM_ID":1,"EVENT_ID":1,"STATUS":"1"}` |

STATUS ต้องเป็น '0'/'1'; ไม่ส่ง ID ตอน POST ระบบออกให้ Mapping ต้องอ้าง master ที่มีอยู่ Response create/update เช่น `{ "status":true, "data":{"LOCATION_ID":1} }`

ชื่อ Location ≤100, Cause ≤300, Problem ≤200, Initial ≤300, Event แต่ละช่อง ≤100 ตัวอักษร ถ้าถูกใช้งานอยู่จะลบไม่ได้ (409) ให้แก้ STATUS เป็น '0' แทน

## 7. CRUD รายตาราง (ระบุ ID เอง)

POST ใช้ URL ฐานในตาราง; PATCH/DELETE ต่อท้าย key GET มีเฉพาะที่ระบุในหัวข้อ 2 ไม่ได้มี GET ราย key ทุกตาราง

| URL หลัง /workload/ | Key ต่อท้ายสำหรับ PATCH/DELETE | ตัวอย่าง POST body |
|---|---|---|
| piline_location_mst | /1 | `{"LOCATION_ID":1,"LOCATION_NAME":"Line A","STATUS":"1"}` |
| piline_cause_mst | /1 | `{"CAUSE_ID":1,"CAUSE_NAME":"Machine","STATUS":"1"}` |
| piline_problem_mst | /1 | `{"PROBLEM_ID":1,"PROBLEM_NAME":"Stop","STATUS":"1"}` |
| piline_event_mst | /1 | `{"EVENT_ID":1,"MAIN_CATEGORY":"Machine","EVENT_TYPE":"Stop","PRODUCTION_IMPACT":"Delay","STATUS":"1"}` |
| piline_initial_mst | /1 | `{"INITIAL_ID":1,"INITIAL_DETAIL":"Adjust","STATUS":"1"}` |
| piline_mapping_mst | /1 | `{"MAP_ID":1,"LOCATION_ID":1,"CAUSE_ID":1,"PROBLEM_ID":1,"EVENT_ID":1,"STATUS":"1"}` |
| piline_section_mst | /051403 | `{"SSECCODE":"051403"}` |
| piline_ng_record | /PI261022001 | `{"PILINE_NO":"PI261022001","ID_TAG":"12345678901","QTY":1,"MAT_NO":"MAT001"}` |
| piline_att | /PI261022001/1/EVT | `{"PILINE_NO":"PI261022001","SEQ":1,"TYPEFILE":"EVT","FILENAME":"PI261022001/photo.jpg"}` |

POST event record ตัวอย่าง:

```http
POST {{BASE_URL}}/workload/piline_event_record
```

```json
{
  "PILINE_NO":"PI261022001","EVENT_DATE":"2026-10-22T00:00:00+07:00","RUN_NO":1,
  "SHIFT":"Day","START_TIME":"2026-10-22T08:00:00+07:00","END_TIME":"2026-10-22T08:30:00+07:00",
  "LOCATION_ID":1,"CAUSE_ID":1,"PROBLEM_ID":1,"INITIAL_ID":1,
  "SSECCODE":"051403","IS_NG":"0","DETAIL":"Machine stop","CREATE_BY":"12345"
}
```

CRUD นี้ต้องระบุเลขเองและไม่ได้สร้าง NG/ATT ให้ แม้ส่ง IS_NG='1' ตัวอย่าง PATCH:

```http
PATCH {{BASE_URL}}/workload/piline_event_record/PI261022001
```

```json
{"REMARK":"Updated remark","UPDATE_BY":"12345"}
```

PATCH CRUD ส่งเฉพาะช่องที่แก้ ห้ามเปลี่ยน key ส่วน Section มีแต่ key ไม่มีช่องที่ PATCH ได้จริง จึงตอบ 400

DELETE CRUD คือ **ลบจริง** ไม่ใช่เปลี่ยน status และไม่ลบไฟล์จริง การลบ Event ที่มี NG ต้องจัดการ FK ก่อน ตัวอย่าง `DELETE /workload/piline_ng_record/PI261022001` แล้ว `DELETE /workload/piline_event_record/PI261022001` การลบ ATT ผ่าน CRUD ลบเฉพาะ metadata

Response CRUD เช่น `{ "status":true, "message":"Created successfully", "data":{"PILINE_NO":"PI261022001"} }`

## 8. Reject Notice

### ตรวจ reference และข้อมูลชิ้นงาน

```http
GET {{BASE_URL}}/workload/piline_issue/reference?number=CN26-000001
GET {{BASE_URL}}/workload/piline_issue/part?order=ORDER001&drawing=DWG001
```

reference รองรับ CN/PT/RQ รูปแบบ XX26-000001 คืน `{status:true,data:{number,exists}}`; part ใช้ Order/Drawing ค้น AS400 คืน `{status:true,data:[...]}` ใช้ URL encoding หากมีอักขระพิเศษ

### ตรวจข้อมูลก่อนสร้างฟอร์ม

```http
POST {{BASE_URL}}/workload/piline_issue/request/prepare
```

```json
{
  "REQUESTER":"12345","INPUTBY":"12345",
  "TID":1,"SECCODE":"051403","CID":1,"WID":1,
  "PRONG":"Bending","EXPLAIN":"Surface scratch","REMARK":"",
  "RELATED":[],"URGENT":false,"NEED_NEW_PART":"Y",
  "PARTS":[{"PILINE_NO":"PI261022001","QTY":1}]
}
```

TID/CID/SECCODE ต้องมีใน master RN จริง; REQUESTER/INPUTBY 5 หลัก; WID เป็น 1–5 และถ้า 1/2 ต้องส่ง NEED_NEW_PART='Y'/'N' PARTS 1–100 รายการไม่ซ้ำ เลือกได้เฉพาะ NG/ACTIVE ที่มี Order/Drawing และข้อมูลชิ้นงานชัดเจน ใส่ REFNO เช่น CN26-000001 ในแต่ละ part ได้

prepare ตรวจอย่างเดียว คืน `{status:true}` ไม่สร้าง WEBFORM

### บันทึกหลังสร้าง WEBFORM แล้ว

```http
POST {{BASE_URL}}/workload/piline_issue/request
```

```json
{
  "KEY":{"NFRMNO":4,"VORGNO":"000101","CYEAR":"18","CYEAR2":"2026","NRUNNO":1},
  "REQUEST":{
    "REQUESTER":"12345","INPUTBY":"12345","TID":1,"SECCODE":"051403","CID":1,"WID":1,
    "PRONG":"Bending","EXPLAIN":"Surface scratch","REMARK":"",
    "RELATED":[],"URGENT":false,"NEED_NEW_PART":"Y",
    "PARTS":[{"PILINE_NO":"PI261022001","QTY":1}]
  }
}
```

KEY ต้องมาจาก WEBFORM จริงและ requester/inputer ตรงกัน NFRMNO=4,VORGNO='000101',CYEAR='18' เป็นค่าบังคับของ DTO นี้

บันทึก RN/รายละเอียดและ flow พร้อมเปลี่ยน Event ที่เลือกเป็น QC_REJECT และใส่ REF_RN_CYEAR2/REF_RN_NRUNNO ใน transaction เดียว ถ้าฟอร์มถูกบันทึกแล้วคืน alreadySaved:true

### แนบไฟล์ RN

```http
POST {{BASE_URL}}/workload/piline_issue/request/files
Content-Type: multipart/form-data
```

- payload (Text) = JSON ของ KEY 5 ช่องโดยตรง ไม่ครอบ KEY
- files (File) = แนบหลายไฟล์ได้ สูงสุด 10 ต่อ request ไฟล์ละ 5 MB
- ต้องบันทึก RN สำเร็จก่อน ต้องตั้ง PILINE_RN_FILE_PATH เป็น absolute path และบัญชี service เขียนได้
- รองรับ pdf/jpg/jpeg/png/gif/webp/xlsx/xls/docx/doc/pptx/ppt/txt/csv; ระบบเปลี่ยนชื่อและบันทึก ATTRNFRM
- คืน status,data พร้อม folder และ files (ID,SFILE,TYPENO,originalName)

## 9. Bending

| Method | URL | การใช้งาน |
|---|---|---|
| GET | /workload/piline_bending_main | อ่านทั้งหมด |
| GET | /workload/piline_bending_main/:IDTAG | อ่านตาม IDTAG |
| POST | /workload/piline_bending_main/search | ค้นด้วย FiltersDto |
| POST | /workload/piline_bending_main | สร้างข้อมูล |
| GET | /workload/piline_bending_att | อ่าน metadata ไฟล์ทั้งหมด |
| GET | /workload/piline_bending_att/:idtag | อ่าน metadata ตาม IDTAG |
| POST | /workload/piline_bending_att/search | ค้น metadata |
| POST | /workload/piline_bending_att | สร้าง metadata |

Bending main body:

```json
{"IDTAG":"12345678901","TYPE":"A","SHEET_COLOR":"Silver","ITEM":"121","AT":1.2,"BT":1.1,"RECORD_BY":"12345","RECORD_DATE":"2026-10-22T08:00:00+07:00"}
```

IDTAG บังคับ ช่องอื่น optional: TYPE/SHEET_COLOR/ITEM/RECORD_BY string, AT/BT/AM/BM/AL/BL/TA1–TA4/TB1–TB4 number และ RECORD_DATE date

search body ใช้ได้กับ main และ att:

```json
{"filters":[{"field":"IDTAG","op":"eq","value":"12345678901"}]}
```

รองรับ AND/OR แบบ nested และ op eq,ne,gt,gte,lt,lte,like,startsWith,endsWith,in,notIn,between,isNull,isNotNull ตาม FiltersDto

Bending attachment body:

```json
{"IDTAG":"12345678901","ID":1,"FILE_NAME":"photo.jpg"}
```

**จุดที่พบใน source:** entity `piline_bending_att` ปัจจุบันประกาศชื่อ table เป็น `PILINE_BENDING_MAIN` ไม่ใช่ ATT ดังนั้นควรตรวจ mapping นี้ก่อนใช้งานเขียนจริง คู่มือนี้ไม่ได้แก้ไขโค้ดจุดดังกล่าว และไม่ได้ยืนยันว่า endpoint att ทำงานถูกต้องกับฐานข้อมูลจริง

## 10. Error และข้อจำกัด

| HTTP | ความหมายที่พบบ่อย |
|---|---|
| 400 | รูปแบบข้อมูล/ไฟล์/master/วันที่/เงื่อนไข NG ไม่ถูกต้อง |
| 404 | ไม่พบรายการ, ID Tag หรือไฟล์ |
| 409 | key ซ้ำ, FK, รายการถูกใช้งาน/ล็อก หรือข้อมูลแก้ไขไม่ตรงสถานะ |
| 503 | DB Link, storage หรือ commit ไม่ทราบผลตาม endpoint |

Bending บางกรณีคืน status:false พร้อม message แทน HTTP error ต้องตรวจ response body ด้วย ตัวอย่างทั้งหมดอธิบายรูปแบบ ไม่ใช่ข้อมูลที่รับรองว่ามีอยู่จริง ไม่ได้เรียก API เขียนข้อมูลในการจัดทำคู่มือนี้

รายการ endpoint และข้อกำหนด DTO ทั้งหมด: [PI-LINE-REFERENCE.md](PI-LINE-REFERENCE.md)
