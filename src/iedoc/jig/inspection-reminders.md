# คู่มือ API แจ้งเตือน JIG Inspection ทางอีเมล

## รายละเอียดการทำงาน

API ส่งอีเมลแยก 1 ฉบับต่อ 1 JIG โดยอ่าน `JIG_MASTER` เฉพาะ `JIG_STATUS = 'ACTIVE'` และ `NEXT_INSPEC_DATE` ไม่เป็น NULL เปรียบเทียบเฉพาะวันที่ ไม่รวมเวลา

| ประเภท | เงื่อนไข |
|---|---|
| Reminder | NEXT_INSPEC_DATE − วันที่ประมวลผล เท่ากับ 30, 14 หรือ 7 วัน |
| Overdue | วันที่ประมวลผล > NEXT_INSPEC_DATE ส่งทุกวัน |

วันครบกำหนดพอดีจะไม่ส่ง เมื่อการอนุมัติครบทำให้ระบบเดิมเปลี่ยน NEXT_INSPEC_DATE เป็นรอบใหม่ รายการจะไม่เข้าเงื่อนไข overdue เดิมอีก API นี้ไม่สร้างฟอร์ม และไม่แก้ไข master

ตัวอย่าง NEXT_INSPEC_DATE = `01/11/2026`:

| วันที่รัน | ผล |
|---|---|
| 02/10/2026 | Reminder 30 วัน |
| 18/10/2026 | Reminder 14 วัน |
| 25/10/2026 | Reminder 7 วัน |
| 01/11/2026 | ไม่ส่ง |
| 02/11/2026 | Overdue 1 วัน |

## ผู้รับ TO / CC

นำ `JIG_MASTER.PIC_EMPNO` เชื่อม `AMEC.AMECUSERALL.SEMPNO` เพื่ออ่าน Controller: `SNAME`, `SRECMAIL`, `SSECCODE`, `SDEPCODE`

| ผู้รับ | วิธีค้น |
|---|---|
| TO | Controller.SRECMAIL |
| CC1 | WEBFORM.ORGPOS ที่ VORGNO = Controller.SSECCODE และ VPOSNO = '30' |
| CC2 | WEBFORM.ORGPOS ที่ VORGNO = Controller.SDEPCODE และ VPOSNO = '20' |

สำหรับ CC ใช้ `ORGPOS.VEMPNO` เชื่อม `AMECUSERALL.SEMPNO` เพื่ออ่าน `SRECMAIL` และ `SNAME` หากพบหลายคนในตำแหน่งนั้น จะรวมผู้รับที่พบทั้งหมด

## Request

```http
POST /iedoc/jig/inspection-reminders
Content-Type: application/json
```

ใช้ base URL และข้อมูลยืนยันตัวตนตามระบบ API ที่ใช้งานอยู่

| Property | Type | Required | รายละเอียด |
|---|---|---|---|
| date | string | ไม่บังคับ | DD/MM/YYYY ต้องเป็นวันที่มีจริง ไม่ส่ง = วันนี้ตาม Asia/Bangkok |
| dryRun | boolean | ไม่บังคับ | true = ดูตัวอย่าง ไม่ส่งอีเมล ค่าเริ่มต้น false |
| to | string[] | ไม่บังคับ | แทนที่ TO จากฐานข้อมูล ต้องมีอย่างน้อย 1 อีเมล |
| cc | string[] | ไม่บังคับ | แทนที่ CC ทั้งหมด ใช้ [] เพื่อไม่ส่ง CC |

endpoint นี้รับ `to` / `cc` เป็น **Array เท่านั้น** แม้ MailService กลางรองรับ String ด้วย

### ดูตัวอย่างของวันนี้โดยไม่ส่งจริง

```json
{ "dryRun": true }
```

### ดูตัวอย่างย้อนหลัง

```json
{ "date": "02/10/2026", "dryRun": true }
```

การรันย้อนหลังใช้ข้อมูล master และผู้รับ **ปัจจุบัน** มาเทียบกับวันที่ที่ส่ง ไม่ได้คืนข้อมูลฐานข้อมูลตามประวัติในอดีต

### ทดสอบส่งจริงไปอีเมลที่กำหนด

```json
{
  "date": "02/10/2026",
  "to": ["tester@example.com"],
  "cc": []
}
```

เปลี่ยนอีเมลตัวอย่างเป็นของคุณก่อนเรียก ทุก JIG ที่เข้าเงื่อนไขจะส่งแยกเข้าอีเมลทดสอบนี้ หากต้องการ CC ทดสอบ ใช้ `"cc": ["test-manager@example.com"]`

**ถ้า override เฉพาะ to แต่ไม่ส่ง cc จะยังส่ง CC ไปหาผู้รับจริงจากฐานข้อมูล** จึงควรระบุ `cc: []` หรือ CC ทดสอบด้วย

### ส่งจริงตามฐานข้อมูล

```json
{}
```

Job ประจำวันต้องไม่ระบุ date ค้างไว้ เพื่อให้ใช้วันที่ปัจจุบันทุกครั้ง

### ตัวอย่าง PowerShell สำหรับ Preview

```powershell
$apiBase = 'http://localhost:3000'
$payload = @{ dryRun = $true } | ConvertTo-Json
Invoke-RestMethod -Method Post `
  -Uri "$apiBase/iedoc/jig/inspection-reminders" `
  -ContentType 'application/json' `
  -Body $payload
```

## รูปแบบอีเมล

Reminder ใช้ Subject:

```text
[JIG Inspection] Reminder – Annual JIG Inspection Due Soon – 30 Days
```

จำนวนวันเปลี่ยนเป็น 30 / 14 / 7 ตามรายการจริง เนื้อหาระบุ JIG No., JIG Name, Controller, Next Inspection Due Date และ Remaining พร้อมขอให้ตรวจให้เสร็จก่อนครบกำหนด

Overdue ใช้ Subject:

```text
[JIG Inspection] OVERDUE – Immediate Action Required
```

เนื้อหาระบุ JIG No., JIG Name, Controller, Due Date และ Overdue พร้อมข้อความว่าจะส่งทุกวันจนตรวจและอนุมัติเสร็จ วันที่แสดง DD/MM/YYYY ทั้งสองกรณีลงท้าย JIG Yearly Inspection System / IE Department

ส่งเป็น HTML ผ่าน MailService กลาง สามารถตรวจเนื้อหาเต็มจาก `items[].html` ใน dryRun ได้

## อ่านผลลัพธ์

ตัวอย่างโครงสร้างผลลัพธ์ (ย่อ HTML):

```json
{
  "asOf": "02/10/2026",
  "dryRun": true,
  "summary": { "total": 1, "sent": 0, "preview": 1, "skipped": 0, "failed": 0 },
  "items": [{
    "JIG_NO": "J26-001",
    "daysUntilDue": 30,
    "type": "REMINDER",
    "status": "PREVIEW",
    "originalRecipients": {
      "to": {
        "SEMPNO": "12345", "SNAME": "Controller Name",
        "SRECMAIL": "controller@example.com",
        "SSECCODE": "051403", "SDEPCODE": "051401"
      },
      "cc1": [{ "SEMPNO": "11111", "SNAME": "Section Manager", "SRECMAIL": "section@example.com" }],
      "cc2": [{ "SEMPNO": "22222", "SNAME": "Department Manager", "SRECMAIL": "department@example.com" }]
    },
    "to": ["controller@example.com"],
    "cc": ["section@example.com", "department@example.com"],
    "subject": "[JIG Inspection] Reminder – Annual JIG Inspection Due Soon – 30 Days",
    "html": "<p>Dear Controller,</p>...",
    "issues": []
  }]
}
```

| Status | ความหมาย |
|---|---|
| PREVIEW | ตรวจผู้รับผ่าน แต่ไม่ส่งเพราะ dryRun |
| SENT | MailService ส่งสำเร็จ ไม่มีผู้รับถูก SMTP ปฏิเสธ ไม่ใช่ยืนยันว่าเข้า Inbox แล้ว |
| SKIPPED | ผู้รับไม่ครบหรืออีเมลไม่ถูกต้อง ดู issues |
| FAILED | เกิดข้อผิดพลาด ดู error |

`originalRecipients` เก็บชื่อและอีเมลตามฐานข้อมูล ส่วน `to` / `cc` คือผู้รับหลัง override บางฟิลด์อาจไม่มีหากเกิดข้อผิดพลาดก่อนสร้างอีเมล

ต้องตรวจ `summary.failed` และ `summary.skipped` ด้วย แม้ HTTP สำเร็จ เพราะรายการอื่นยังทำงานต่อเมื่อบางรายการล้มเหลว หาก query หลักล้มเหลวจะคืน request error แทนผลสรุป

## ตั้ง Job ทุกเช้า 08:00 น.

ใช้ `POST /scheduler/create` ตาม payload ในหัวข้อ Existing application Scheduler ด้านล่าง เปลี่ยน employee number เป็นรหัสพนักงานจริงก่อนเรียก

- `PARAMETES` สะกดตาม API เดิม และต้องเป็น JSON string เช่น `"{}"`
- URL เป็น path ภายใน ไม่มี `/` นำหน้า
- Cron `0 8 * * *` = ทุกวัน 08:00 น.
- Scheduler เดิมใช้ timezone ของ server/process ต้องตั้งเป็นเวลาไทยเพื่อให้รัน 08:00 น. ประเทศไทย
- ถ้ามี Job แล้วให้ปรับ Job เดิม อย่าสร้างซ้ำ
- โค้ดนี้ไม่ได้ลงทะเบียน Job ให้อัตโนมัติ ต้องสร้าง Job ในระบบที่จะใช้งาน

ตรวจรายการและเวลาทำงานได้ที่ `GET /scheduler/jobs` และ `GET /scheduler/runtime-jobs`

`HEAD /iedoc/jig/inspection-reminders` มีไว้ให้ Scheduler ตรวจ endpoint โดยไม่ส่งอีเมล

## การตั้งค่าและแก้ปัญหา

ใช้ `MAIL_HOST`, `MAIL_PORT`, `MAIL_FROM` ของ MailService เดิม บัญชี `iedocConnection` ต้องอ่าน IEDOC.JIG_MASTER, AMEC.AMECUSERALL และ WEBFORM.ORGPOS ได้

| อาการ | ตรวจสอบ |
|---|---|
| total = 0 | ACTIVE, NEXT_INSPEC_DATE และวันที่รันเข้าเงื่อนไขหรือไม่ |
| SKIPPED | issues, PIC_EMPNO, SRECMAIL, Section/Department และ ORGPOS |
| FAILED | error, สิทธิ์ query, SMTP และการเชื่อมต่อ |
| 400 | วันที่ อีเมล ชนิดข้อมูล หรือ property ที่ไม่รองรับ |
| 409 | มี reminder run ทำงานอยู่ใน service instance เดียวกัน |
| Job รันผิดเวลา | timezone ของ server/process และ runtime-jobs |

ระบบไม่ได้เปลี่ยนผู้รับไป MAIL_ADMIN อัตโนมัติใน development ให้ใช้ dryRun หรือ override to และ cc สำหรับทดสอบ

ยังไม่มีตารางประวัติป้องกันส่งซ้ำรายวัน เรียกซ้ำจะส่งซ้ำได้ หาก SMTP ปฏิเสธบางผู้รับ รายการจะเป็น FAILED แต่บางคนอาจได้รับแล้ว ไม่ควร retry ทั้งชุดโดยไม่ตรวจผล

## ไฟล์ที่เกี่ยวข้องและผลทดสอบ

- `src/iedoc/jig/jig-reminder.service.ts`: ค้น JIG/ผู้รับ สร้างและส่งอีเมล
- `src/iedoc/jig/dto/inspection-reminder.dto.ts`: ตรวจ request
- `src/iedoc/jig/jig.controller.ts`: endpoint POST/HEAD
- `src/iedoc/jig/jig.module.ts`: ลงทะเบียน service และ MailModule
- `src/iedoc/jig/jig-reminder.spec.ts`: unit tests

TypeScript ผ่าน และ unit tests 16 รายการผ่าน โดย mock ฐานข้อมูลและ MailService ยังไม่ใช่การทดสอบ query หรือส่งอีเมลจริงบน server

## Quick reference (English)

`POST /iedoc/jig/inspection-reminders`

Real daily run: `{}`. Uses today's calendar date in Asia/Bangkok.
Sends one email per ACTIVE JIG at exactly 30/14/7 days before its due date,
or every day after its due date. The due date itself is excluded.
Approved inspections stop overdue notifications when the master due date changes.

Preview (no mail sent):

```json
{ "date": "02/10/2026", "dryRun": true }
```

Test delivery (all TO/CC replaced; no original recipients receive mail):

```json
{ "date": "02/10/2026", "to": ["tester@example.com"], "cc": [] }
```

Omit `date` on the daily job. Dates must be real DD/MM/YYYY calendar dates.
`to` and `cc` accept arrays; omitted fields use database recipients.
`cc: []` disables CC. Original names/employee numbers/emails remain available
in `items[].originalRecipients.to/cc1/cc2` for diagnostics.
CC1 uses Controller.SSECCODE / position 30; CC2 uses Controller.SDEPCODE / position 20.
If an organization position has multiple employees, all matching employees are included.
Missing/invalid recipients skip that JIG with `issues`; other JIGs continue.
SMTP errors are returned per item. Check summary.failed and summary.skipped,
not just the HTTP success code. A partially rejected SMTP delivery may have reached some recipients.

## Existing application Scheduler

Register ONE daily job through `POST /scheduler/create` (replace employee placeholders):

```json
{
  "NAME": "JIG inspection daily reminder",
  "URL": "iedoc/jig/inspection-reminders",
  "PARAMETES": "{}",
  "CRON_EXPRESSION": "0 8 * * *",
  "DESCRIPTION": "JIG reminder 30/14/7 days and daily overdue at 08:00",
  "IS_ACTIVE": 1,
  "INCHARGE": "<employee number>",
  "CREATE_BY": "<employee number>"
}
```

The existing Scheduler uses the server/process timezone; configure that as
Asia/Bangkok for 08:00 Thailand time. HEAD on the reminder endpoint is read-only
and supports the Scheduler's endpoint validation.
This implementation does not automatically register a live job or send test mail.
Mail uses the existing MAIL_HOST/MAIL_PORT/MAIL_FROM configuration.
No additional implicit environment-based recipient redirection is applied.

Each invocation sends matching emails again; there is no persistent daily send ledger.
Avoid duplicate schedule registrations or manual retries of successful runs.
A service-local guard prevents overlapping calls in one process; the existing
Scheduler provides its own Redis lock for scheduled instances. This is not
exactly-once delivery across manual calls, processes, or restarts.
