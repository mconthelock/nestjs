# คู่มือ JIG API

## เริ่มใช้งาน

- Base URL: `{{BASE_URL}}` เช่น `http://localhost:3000` หรือ URL ที่ระบบ deploy จริง
- Prefix: `/iedoc/jig`
- JSON request ใช้ `Content-Type: application/json`
- ชื่อ property ต้องตรงตัวพิมพ์ใหญ่/เล็ก ระบบปฏิเสธ property ที่ไม่ได้อยู่ใน DTO
- GET/HEAD/DELETE ในคู่มือนี้ไม่ต้องส่ง body
- ถ้า deployment มี gateway/authentication ให้ส่ง credentials ตามระบบนั้น
- วันที่ทั่วไปใน JSON ใช้ ISO เช่น `2026-11-01`; เฉพาะ Job `date` ใช้ `01/11/2026`
- ไม่มี endpoint อนุมัติ workflow อยู่ใน JIG controller: ต้องเดินอนุมัติผ่านระบบ WEBFORM ก่อนเรียก finish

## 1. Dashboard และข้อมูลอ้างอิง

| Method | Path ต่อท้าย /iedoc/jig | หน้าที่ |
|---|---|---|
| GET | /dashboard | สถานะ JIG จาก master ไม่มี FYEAR |
| GET | /mfg-processes | Process ที่ STATUS = '1' |
| GET | /locations | SHOPCODEMST ที่ STATUS = '1' |
| GET | /ie-pics | พนักงาน IE SDEPCODE='051401', CSTATUS='1', SPOSCODE ไม่ใช่ 30/20/21 |
| GET | /:jigNo | ข้อมูล master รายตัว |
| GET | /:jigNo/checkpoints | Checkpoint ของ master |
| GET | /:jigNo/defect-ng | คืน `{ "NG": ... }` หรือ NG เป็น null |
| GET | /:jigNo/forms | ประวัติฟอร์มและสถานะ |

ตัวอย่าง `GET {{BASE_URL}}/iedoc/jig/J26-001/checkpoints`

Dashboard คืน `asOf`, `dueSoonDays: 30`, `summary` (total/dueToday/dueSoon/overdue/planned/unscheduled) และ `items` พร้อม SNAME, DUE_STATUS, DASHBOARD_STATUS, DAYS_UNTIL_DUE, IS_DUE

สถานะ: UNSCHEDULED ไม่มีวันตรวจ, OVERDUE เลยกำหนด, DUE ครบวันนี้, DUE_SOON อีกไม่เกิน 30 วัน, PLANNED มากกว่า 30 วัน โค้ด dashboard ปรับวันที่เป็นวันที่ 1 ของเดือนตามแนวคิดวันครบรอบ

## 2. Key ฟอร์ม 5 ช่อง

ตัวอย่าง key ที่ใช้ตลอดคู่มือ:

```json
{"NFRMNO":31,"VORGNO":"051401","CYEAR":"26","CYEAR2":"2026","NRUNNO":1}
```

ใน URL เขียนเป็น `31/051401/26/2026/1` เรียงตามลำดับด้านบน ห้ามเดา NRUNNO ต้องใช้ key ที่ได้จาก WEBFORM จริง โดย NFRMNO/NRUNNO เป็นตัวเลข ส่วน VORGNO/CYEAR/CYEAR2 เป็น string เพื่อรักษาศูนย์นำหน้า

## 3. ขอสร้าง JIG ใหม่

```http
POST {{BASE_URL}}/iedoc/jig
```

ต้องสร้าง WEBFORM.FORM/FLOW ผ่านกระบวนการเดิมก่อน แล้วใช้ key นั้นส่งมาที่ JIG API:

```json
{
  "NFRMNO":31,"VORGNO":"051401","CYEAR":"26","CYEAR2":"2026","NRUNNO":1,
  "FORM_TYPE":"CREATE",
  "JIG_NAME":"Inspection fixture",
  "REV":"0",
  "START_USE_DATE":"2026-11-01",
  "INSPEC_PERIOD":6,
  "PIC_EMPNO":"12345",
  "DWG":"DWG-001","JIG_QTY":1,"PRICE":1500.50,"MAKER":"Supplier",
  "ITEMNO":"0121","JIG_DESC":"Fixture for inspection",
  "PROCESS_CODE":"G3RB04","LOCATION":"K4",
  "DETAILS":[{
    "CHECK_SEQ":1,"CHECK_POINT":"Flatness","INSPECTION_TOOL":"Dial gauge",
    "MIN":-0.15,"MAX":0.15,"MEASURED_VALUE":-0.11,"UNIT":"mm","RESULT":"OK"
  }],
  "FILES":[],"NG":null
}
```

สร้าง JIG_FORM/DETAIL/FILE/NG เป็นข้อมูล snapshot ก่อน ยังไม่เขียน master จนอนุมัติครบ

- ไม่ส่ง JIG_NO จะออกเลข `Jyy-###` จากเลขสูงสุดใน JIG_MASTER และ JIG_FORM ของปีปัจจุบัน +1
- ส่ง JIG_NO เองได้ผ่าน POST นี้ หรือใช้ `POST /iedoc/jig/J26-001/forms` กับ body แบบเดียวกันแต่ไม่ใส่ JIG_NO ใน body
- createForm รับกรณี CREATE เท่านั้น แม้ DTO ระบุ INSPECTION ไว้ด้วย; INSPECTION ต้องใช้ auto-inspection
- สำหรับ JIG ใหม่ต้องมี JIG_NAME, REV เริ่ม '0', INSPEC_PERIOD, START_USE_DATE และ DETAILS หรือ CHECKPOINTS ที่ไม่ว่าง
- DETAILS กับ CHECKPOINTS ห้ามส่งพร้อมกัน; DETAILS รองรับผล RESULT/MEASURED_VALUE
- CHECK_SEQ 1–999, ค่าทศนิยม MIN/MAX/MEASURED_VALUE รองรับติดลบและไม่เกิน 4 ตำแหน่ง
- DTO ปัจจุบันจำกัด ITEMNO ไม่เกิน **4 ตัวอักษร** แม้ฐานข้อมูลบางรุ่นจะขยายแล้ว
- ถ้ามี NG ให้ส่ง PICCODE สำหรับ approver ของ flow 07 ด้วย

ข้อมูล NG ตัวอย่าง (นำไปใส่ใน body):

```json
{
  "PICCODE":"15199",
  "NG":{
    "DEFECT_DETAIL":"Flatness out of tolerance",
    "ACTION":"Adjust,Modify",
    "CORRECTIVE":"Adjust and inspect again",
    "PLAN_DATE":"2026-11-05"
  }
}
```

NG เป็น object เดียวต่อฟอร์ม ไม่ใช่ array ไม่มี LOCATION ใน NG ใช้ LOCATION ของฟอร์มหลัก

## 4. อ่านและแก้ไขฟอร์ม

```http
GET {{BASE_URL}}/iedoc/jig/forms/31/051401/26/2026/1
PATCH {{BASE_URL}}/iedoc/jig/forms/31/051401/26/2026/1
```

ตัวอย่าง PATCH:

```json
{
  "REMARK":"Inspection completed",
  "DETAILS":[{"CHECK_SEQ":1,"MEASURED_VALUE":-0.11,"RESULT":"OK"}],
  "NG":null,
  "UPDATE_BY":"12345"
}
```

อ่านฟอร์มจะได้ข้อมูลหลักพร้อมรายละเอียด/ไฟล์/NG การแก้ไขทำได้เมื่อ WEBFORM.CST เป็น '0' หรือ '1'

- ไม่ส่ง NG = คงข้อมูลเดิม; NG:null = ลบ NG ของฟอร์ม
- REPLACE_DETAILS:true = แทนชุดรายละเอียด ต้องส่ง DETAILS ที่ไม่ว่างพร้อมข้อมูลจุดตรวจให้ครบ
- REPLACE_FILES:true = แทนชุด metadata ไฟล์ ต้องส่ง FILES ที่ไม่ว่าง; หากลบไฟล์ทั้งหมดให้ใช้ DELETE รายไฟล์
- `PATCH /iedoc/jig/:jigNo` เป็นอีกทางสำหรับแก้ **snapshot ฟอร์ม** ไม่ใช่อัปเดต master โดยตรง ต้องเพิ่ม FORM_KEY:

```json
{
  "FORM_KEY":{"NFRMNO":31,"VORGNO":"051401","CYEAR":"26","CYEAR2":"2026","NRUNNO":1},
  "REMARK":"Updated from JIG page"
}
```

### ปรับ requester flow

```http
POST {{BASE_URL}}/iedoc/jig/forms/31/051401/26/2026/1/requester-flow
```

```json
{"PICCODE":"15199"}
```

เรียกหลังบันทึก NG ก่อน requester approve ตาม step ที่ frontend ตัดสินใจ หากฟอร์มมี NG จะสร้างหรือปรับ flow 07 และเปลี่ยน 06 → 07; ไม่มี NG จะลบ 07 และเปลี่ยน 06 → 04 กรณีไม่มี NG ส่ง `{}` ได้

## 5. ไฟล์แนบ และ NG Tag PDF

```http
PUT {{BASE_URL}}/iedoc/jig/forms/31/051401/26/2026/1/files
```

```json
{
  "FILE_SEQ":1,"FILE_NAME":"inspection_photo.jpg",
  "FILE_PATH":"IE-JIG26-000001/inspection_photo.jpg",
  "FILE_TYPE":"image/jpeg","FILE_SIZE":12345,"CREATE_BY":"12345"
}
```

endpoint นี้รับ **metadata JSON** ไม่รับ binary multipart ให้ upload ไฟล์จริงผ่านระบบ frontend/PHP ที่มีอยู่ แล้วบันทึกชื่อ/path เดียวกัน

- ลบ metadata: `DELETE /iedoc/jig/forms/31/051401/26/2026/1/files/1`
- ดู/พิมพ์ PDF: `GET /iedoc/jig/forms/31/051401/26/2026/1/ng-tag.pdf`
- PDF คืน binary application/pdf ขนาด A5 ไม่ใช่ JSON; ไม่มี NG จะได้ 404
- Stamp ใช้ flow '--', '06', '07'; INSPECTOR/FOREMAN ใช้ SSEC, APPROVAL ใช้ AMEC
- Server ต้องมี Playwright browser ที่ใช้งานได้สำหรับ generate PDF

## 6. หลังอนุมัติครบ: apply กลับ master

```http
POST {{BASE_URL}}/iedoc/jig/forms/31/051401/26/2026/1/finish
```

```json
{"UPDATE_BY":"12345"}
```

ส่ง `{}` ได้ UPDATE_BY เป็น optional โค้ดตรวจ WEBFORM.CST = '2' ก่อนทำงาน ไม่ได้อนุมัติ flow ให้

ต้องกรอกผลทุก checkpoint เป็น OK/NG และค่าที่วัดหากมี MIN/MAX; ผล NG ต้องมี corrective NG

| ข้อมูลฟอร์ม | ผลหลัง finish |
|---|---|
| JIG_FORM | INSERT/UPDATE JIG_MASTER พร้อม REF_CYEAR2/REF_NRUNNO |
| JIG_FORM_DETAIL | INSERT/UPDATE/ลบจุดที่ถอดออกใน JIG_CHECKPOINT |
| JIG_FORM_NG | บันทึก JIG_DEFECT_NG หรือถ้าไม่มี NG ลบ NG master เดิม |

CREATE + REV '0' ใช้กับ JIG ใหม่; REV '*' ไม่รองรับในโค้ดปัจจุบัน

วันตรวจถัดไป: สร้างใหม่ใช้ START_USE_DATE + INSPEC_PERIOD; รอบเดิมใช้ NEXT_INSPEC_DATE เดิม + INSPEC_PERIOD แล้วเป็นวันที่ 1 ของเดือน ไม่ใช้วันอนุมัติจริง ถ้า apply แล้วคืน `applied:false` โดยไม่เลื่อนรอบซ้ำ

## 7. Checkpoint master โดยตรง

```http
PUT {{BASE_URL}}/iedoc/jig/J26-001/checkpoints
```

```json
{"CHECKPOINTS":[{"CHECK_SEQ":1,"CHECK_POINT":"Flatness","MIN":-0.15,"MAX":0.15,"MEASURED_VALUE":-0.11,"UNIT":"mm"}]}
```

แทนรายการ checkpoint ของ master โดยตรง ไม่ใช่บันทึกผลการอนุมัติ รอบตรวจปกติใช้ฟอร์มและ finish

## 8. ขอเลิกใช้ JIG

สร้าง WEBFORM สำหรับ delete ให้ได้ key จริงก่อน จากนั้น:

```http
POST {{BASE_URL}}/iedoc/jig/delete-forms
```

```json
{
  "NFRMNO":31,"VORGNO":"051401","CYEAR":"26","CYEAR2":"2026","NRUNNO":2,
  "JIG_NO":"J26-001","REASON":"No longer used","DETAIL":"Replace with new fixture","FILES":[]
}
```

เลขฟอร์มในตัวอย่างใช้แสดงรูปแบบเท่านั้น ต้องเปลี่ยนทั้ง 5 key เป็นของ delete form จริง ระบบค้นหัวหน้าจาก FORM.VINPUTER → SEQUENCEORG.HEADNO แล้วแก้ FLOW ที่ CEXTDATA='02' และเปลี่ยน master เป็น PENDING_DELETE

| Method | Path | Body / ผล |
|---|---|---|
| GET | /iedoc/jig/delete-forms/{5-key} | อ่านฟอร์มและ FILES |
| PATCH | /iedoc/jig/delete-forms/{5-key} | `{ "UPDATE_BY":"12345", "REASON":"Updated reason" }` |
| DELETE | /iedoc/jig/delete-forms/{5-key}/files/1 | ลบ metadata ไฟล์ |
| POST | /iedoc/jig/delete-forms/{5-key}/finish | `{}`; WEBFORM ต้อง finish แล้ว → DELETED |
| POST | /iedoc/jig/delete-forms/{5-key}/reject | `{}`; WEBFORM ต้อง reject แล้ว → ACTIVE |

แก้ไข delete form ได้เฉพาะ requester ตามเงื่อนไข flow ปัจจุบัน FILES ไม่เกิน 5 และใช้ folder `IE-DELJIG26-000002` ตาม CYEAR2/NRUNNO ไม่ใช้ prefix IE-JIG

## 9. Job Auto Inspection

```http
POST {{BASE_URL}}/iedoc/jig/auto-inspection
```

```json
{"date":"01/11/2026"}
```

- date บังคับส่ง รับย้อนหลังได้ เลือก ACTIVE ที่ NEXT_INSPEC_DATE ตรงวันนั้นเท่านั้น
- สร้าง FORM/FLOW เป็น DRAFT และ JIG_FORM เป็น INSPECTION
- คัดลอก master/checkpoint/defect NG ไป JIG_FORM/DETAIL/NG; ไม่สร้าง FILE
- REV_OLD คัดลอกจาก REV, RESULT ของรายละเอียดเป็น null
- ผู้ขอ/ผู้สร้างใช้ PIC_EMPNO; ต้องมี REV และ checkpoint ที่ใช้ได้
- ข้ามรายการที่มีฟอร์มค้าง แต่ละ JIG แยก transaction จึงสำเร็จ/ล้มเหลวแยกกัน
- คืน date,total,created,skipped,failed,items
- NFRMNO=31,VORGNO='051401',CYEAR='26' เป็นค่าคงที่ในโค้ด ไม่ใช่ property ที่ endpoint เปิดให้ส่ง
- Job ต้องสร้าง payload date ของวันที่รันจริง อย่าตั้งวันที่คงที่ หากพลาดรอบให้เรียกย้อนหลังชัดเจน

## 10. Job อีเมล

```http
POST {{BASE_URL}}/iedoc/jig/inspection-reminders
```

ส่งจริงวันนี้:

```json
{}
```

ดูผลไม่ส่งจริง:

```json
{"date":"02/10/2026","dryRun":true}
```

ทดสอบส่งเข้าอีเมลเดียว:

```json
{"to":["supamid@MitsubishiElevatorAsia.co.th"],"cc":[]}
```

**โค้ดใช้ 30/14/7 วัน ไม่ใช่ 15 วัน** และส่งทุกวันที่ overdue เมื่อ Job เรียก; วันครบกำหนดพอดีไม่ส่ง ใช้ ACTIVE เท่านั้น

TO มาจาก Controller.PIC_EMPNO → AMECUSERALL.SRECMAIL; CC1 จาก ORGPOS ของ SSECCODE + VPOSNO 30; CC2 จาก SDEPCODE + VPOSNO 20 ผ่าน webformConnection

Response: asOf,dryRun,summary (total/sent/preview/skipped/failed),items; ผู้รับจริงอยู่ใน originalRecipients.to/cc1/cc2 มีชื่อและอีเมล ส่วน to/cc แสดงปลายทางหลัง override

ถ้าไม่ส่ง cc จะใช้ CC จริงแม้ override to แล้ว ต้องใช้ cc:[] เมื่อต้องการทดสอบคนเดียว ไม่ redirect ไป MAIL_ADMIN อัตโนมัติ ไม่มีประวัติป้องกันส่งซ้ำรายวัน

ตั้ง Scheduler เรียก endpoint นี้ด้วย `{}` ทุกวัน เช่น cron `0 8 * * *` บน server timezone ไทย การมี endpoint ไม่ได้ลงทะเบียน Job อัตโนมัติ รายละเอียดเพิ่มเติม: [คู่มืออีเมล](../../src/iedoc/jig/inspection-reminders.md)

## 11. ข้อผิดพลาดและการทดสอบ

400 ข้อมูลไม่ถูกต้อง, 404 ไม่พบ JIG/ฟอร์ม/ไฟล์, 409 สถานะหรือรอบไม่ตรง/ฟอร์มค้าง, 500 ข้อผิดพลาดฐานข้อมูลหรือการสร้าง PDF

ตรวจ summary ของ Job เสมอ แม้ HTTP สำเร็จอาจมี failed/skipped เอกสารนี้ตรวจจาก source ไม่ได้ส่งอีเมล สร้างฟอร์ม หรือเขียนฐานข้อมูลจริง

รายการ endpoint และข้อกำหนด DTO ทั้งหมดอยู่ใน [JIG-REFERENCE.md](JIG-REFERENCE.md)
