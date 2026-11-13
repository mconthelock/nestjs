# PI Line Event Record — หน้าที่ของแต่ละไฟล์

เอกสารอ้างอิงโค้ดใน `D:\php8.5\src\api\src\workload\piline_event_record` ตรวจสอบวันที่ 6 พฤศจิกายน 2026

โฟลเดอร์นี้รวม API สำหรับบันทึกเหตุการณ์การผลิต ข้อมูล NG ไฟล์แนบ การค้นหา ID Tag และการสร้าง Reject Notice จาก Issue Report จึงมีมากกว่าชุด Controller/Service/Repository ของตารางเดียว


## 1. การประกอบ Module และข้อมูลเหตุการณ์พื้นฐาน

| ไฟล์ | หน้าที่ | ความเชื่อมโยง |
| --- | --- | --- |
| [PILINE_EVENT_RECORD.module.ts](PILINE_EVENT_RECORD.module.ts) | ลงทะเบียน Controller, Service, Repository และ Entity พร้อมนำเข้าโมดูลผู้ใช้, AS400 และ Workflow | ถูกนำเข้าโดย `workload.module.ts` เป็นจุดรวมของฟังก์ชันในโฟลเดอร์นี้ |
| [PILINE_EVENT_RECORD.controller.ts](PILINE_EVENT_RECORD.controller.ts) | รับคำขอดูรายการเหตุการณ์ ดูรายการสำหรับ Issue และเพิ่ม/แก้ไข/ลบข้อมูลผ่าน API พื้นฐาน | เรียก `PilineEventRecordService`; ใช้ DTO สำหรับ Create, Update และ Key |
| [PILINE_EVENT_RECORD.service.ts](PILINE_EVENT_RECORD.service.ts) | ส่งต่อการทำงานไป Repository และกำหนดสถานะ `ACTIVE` เมื่อสร้างข้อมูล | ใช้โดย Event Record Controller |
| [PILINE_EVENT_RECORD.repository.ts](PILINE_EVENT_RECORD.repository.ts) | อ่านข้อมูลเหตุการณ์ร่วมกับ NG และไฟล์แนบ เติมข้อมูลชื่อผู้ใช้และชิ้นงาน และกรองรายการที่เหมาะกับ Issue Report | สืบทอด `PilineCrudRepository`; ใช้ทั้ง Event Record Service และ Reject Request Service |

## 2. บันทึกเหตุการณ์พร้อม NG และไฟล์แนบ

| ไฟล์ | หน้าที่ | ความเชื่อมโยง |
| --- | --- | --- |
| [PILINE_EVENT_INPUT.controller.ts](PILINE_EVENT_INPUT.controller.ts) | รับข้อมูล multipart สำหรับสร้าง/แก้ไขเหตุการณ์ แปลง JSON payload ตรวจ DTO จำกัดไฟล์แนบ และเปิดอ่านไฟล์แนบ | เรียก `PilineEventInputService`; ใช้ DTO ใน `SAVE-PILINE_EVENT_INPUT.dto.ts` |
| [PILINE_EVENT_INPUT.service.ts](PILINE_EVENT_INPUT.service.ts) | จัดการการบันทึกเหตุการณ์แบบครบชุด ตรวจ Master/Mapping สร้างเลขรายการ บันทึก Event/NG/ข้อมูลไฟล์ และควบคุม transaction รวมถึงเงื่อนไขการแก้ไข | ใช้ Entity ของ Event, NG, Attachment และ Master ต่าง ๆ ร่วมกับ Event Files Service |
| [PILINE_EVENT_FILES.service.ts](PILINE_EVENT_FILES.service.ts) | ตรวจและจัดเก็บไฟล์แนบ อ่านไฟล์อย่างจำกัดขอบเขต path และจัดการล้างไฟล์ตามผลการบันทึก | ใช้โดย Event Input Service เพื่อประสานไฟล์บนดิสก์กับ transaction ของฐานข้อมูล |

**เหตุผลที่ EVENT_RECORD และ EVENT_INPUT แยกกัน:** กลุ่มแรกให้ API ข้อมูลพื้นฐานและรายการ ส่วนกลุ่ม INPUT รองรับการบันทึก Event + NG + ไฟล์แนบพร้อมกัน ไม่ใช่ไฟล์สำเนาทดสอบของกันและกัน การเปลี่ยนเส้นทางบันทึกต้องตรวจผู้เรียกและกฎ transaction ก่อน

## 3. ค้นหาข้อมูลประกอบ

| ไฟล์ | หน้าที่ | ความเชื่อมโยง |
| --- | --- | --- |
| [PILINE_IDTAG.controller.ts](PILINE_IDTAG.controller.ts) | ค้นหา ID Tag จาก `F110KP` และ Material Code ผ่าน Oracle database link `PILINE_PIIS_LINK` พร้อมตรวจรูปแบบและกรณีไม่พบข้อมูล | ไฟล์นี้มีทั้ง `PilineIdtagController` และ `PilineIdtagService`; ใช้ในหน้าบันทึกเหตุการณ์ |
| [PILINE_ISSUE.controller.ts](PILINE_ISSUE.controller.ts) | ตรวจเลขเอกสารอ้างอิง CN/PT/RQ และค้นหารายละเอียดชิ้นงานจาก Order/Drawing | อ่านข้อมูล WEBFORM และ AS400 เพื่อประกอบฟอร์ม Issue/Reject Notice |

## 4. สร้าง Reject Notice จาก Issue Report

| ไฟล์ | หน้าที่ | ความเชื่อมโยง |
| --- | --- | --- |
| [PILINE_REJECT_REQUEST.controller.ts](PILINE_REJECT_REQUEST.controller.ts) | ตรวจความพร้อมก่อนสร้างคำขอ และบันทึก Reject Notice ตามเลขฟอร์มที่ได้รับ ตรวจผู้ร้องขอ/ผู้บันทึก ล็อกรายการ NG และเปลี่ยนสถานะต้นทางเป็น `QC_REJECT` | มีทั้ง `PilineRejectRequestController` และ `PilineRejectRequestService`; ใช้ Repository, Details Service และ Flow Service |
| [PILINE_REJECT_REQUEST.dto.ts](PILINE_REJECT_REQUEST.dto.ts) | กำหนดและตรวจข้อมูลคำขอ รายการชิ้นงาน และคีย์ฟอร์ม | มี `PilineRejectPartDto`, `PilineRejectRequestDto`, `PilineRejectKeyDto`, `SavePilineRejectDto`; ใช้ใน Request และ Files Controller |
| [PILINE_REJECT_DETAILS.service.ts](PILINE_REJECT_DETAILS.service.ts) | สร้างเลข Reject และบันทึกหัวเอกสาร/รายละเอียดที่เกี่ยวข้อง เช่น `RNFRM`, `RNLIST`, `RNLIST_PP`, `RNFRM_PART` | รับ EntityManager จาก Request Service เพื่อทำงานภายใต้ transaction ที่เรียกใช้ |
| [PILINE_REJECT_FLOW.service.ts](PILINE_REJECT_FLOW.service.ts) | เตรียมผู้เกี่ยวข้อง/ผู้อนุมัติ และปรับขั้นตอน Workflow ให้เหมาะกับคำขอ | ใช้โมดูล Flow, Orgpos และ Rep; เรียกจาก Request Service |
| [PILINE_REJECT_FILES.controller.ts](PILINE_REJECT_FILES.controller.ts) | รับไฟล์แนบของ Reject Notice ตรวจคีย์และไฟล์ บันทึกไฟล์จริงและข้อมูลอ้างอิง `ATTRNFRM` พร้อมจัดการกรณีล้มเหลว | เป็น endpoint แยกจากไฟล์แนบเหตุการณ์ PI Line; ใช้ `PilineRejectKeyDto` |

การบันทึก Reject Request ประสานข้อมูล Reject Notice, Workflow และสถานะเหตุการณ์ต้นทางใน transaction เดียวกัน ส่วนการอัปโหลดไฟล์ Reject เป็นคำขออีก endpoint หนึ่ง

## 5. DTO ในโฟลเดอร์ dto

DTO เป็นโครงสร้างข้อมูลและกฎตรวจสอบ input ไม่ใช่ตารางฐานข้อมูล และไม่ใช่ไฟล์ทดสอบ

| ไฟล์ | หน้าที่ | ผู้เรียกหลัก |
| --- | --- | --- |
| [dto/CREATE-PILINE_EVENT_RECORD.dto.ts](dto/CREATE-PILINE_EVENT_RECORD.dto.ts) | กำหนดข้อมูลและ validation สำหรับสร้างเหตุการณ์ผ่าน API พื้นฐาน | Event Record Controller/Service |
| [dto/UPDATE-PILINE_EVENT_RECORD.dto.ts](dto/UPDATE-PILINE_EVENT_RECORD.dto.ts) | กำหนดข้อมูลและ validation สำหรับแก้ไขเหตุการณ์ผ่าน API พื้นฐาน | Event Record Controller/Service |
| [dto/KEY-PILINE_EVENT_RECORD.dto.ts](dto/KEY-PILINE_EVENT_RECORD.dto.ts) | กำหนดคีย์ `PILINE_NO` สำหรับระบุรายการ | API แก้ไข/ลบใน Event Record Controller/Service |
| [dto/SAVE-PILINE_EVENT_INPUT.dto.ts](dto/SAVE-PILINE_EVENT_INPUT.dto.ts) | กำหนด payload ของการบันทึกครบชุด ข้อมูล NG รายการไฟล์ที่ต้องการลบ และตัวรับ multipart | Event Input Controller/Service; มี `PilineInputNgDto`, `PilineDeleteFileDto`, `SavePilineEventInputDto`, `PilineInputMultipartDto` |

## 6. ไฟล์ทดสอบ

[PILINE_EVENT_INPUT.spec.ts](PILINE_EVENT_INPUT.spec.ts) เป็นชุดทดสอบอัตโนมัติ Jest มี 33 เคส ครอบคลุม เช่น:

- บันทึกเหตุการณ์ทั้งมีและไม่มี NG และสร้างเลขรายการตามวันที่
- ตรวจ Master/Mapping และเงื่อนไขแก้ไขรายการ
- ตรวจชนิดและขนาดไฟล์แนบ รวมถึงการอ่านไฟล์นอกขอบเขตที่อนุญาต
- rollback และล้างไฟล์ใหม่เมื่อบันทึกล้มเหลว
- รักษาไฟล์เดิมเมื่อ transaction ล้มเหลวหรือไม่ทราบผล commit แน่ชัด
- แยกลำดับไฟล์ EVT/NG และลบเฉพาะไฟล์ที่ระบุ

ไฟล์นี้ไม่ได้ลงทะเบียนเป็น Controller/Provider ของระบบ แต่ควรเก็บไว้ทดสอบซ้ำเมื่อแก้โปรแกรม ไม่ใช่ไฟล์ชั่วคราวที่จำเป็นต้องลบหลังทดสอบ

รันทดสอบจากโฟลเดอร์รากของ API:

```powershell
Set-Location D:\php8.5\src\api
npm.cmd test -- --runInBand --runTestsByPath src/workload/piline_event_record/PILINE_EVENT_INPUT.spec.ts
```

ณ วันที่ตรวจสอบ `tsconfig.json` ยังไม่ได้ยกเว้น `*.spec.ts` จาก build และพบไฟล์ทดสอบที่ compile แล้วใน `dist` ทั้ง `.js`, `.d.ts`, `.js.map` หากต้องการลดไฟล์ส่งมอบ ควรแยก build configuration ให้ไม่รวมชุดทดสอบ โดยเก็บ source test ไว้ เอกสารนี้ไม่ได้ปรับ build configuration

## 7. เส้นทาง API สำหรับอ้างอิง

เส้นทางต่อไปนี้อ้างอิง Controller และยังไม่รวม global prefix หรือ base URL ของ deployment

| Method | Path | หน้าที่ |
| --- | --- | --- |
| GET | `workload/piline_event_record` | รายการเหตุการณ์ |
| GET | `workload/piline_event_record/issue` | รายการ NG สถานะ ACTIVE สำหรับ Issue |
| POST | `workload/piline_event_record` | สร้างข้อมูลผ่าน API พื้นฐาน |
| PATCH | `workload/piline_event_record/:PILINE_NO` | แก้ไขผ่าน API พื้นฐาน |
| DELETE | `workload/piline_event_record/:PILINE_NO` | ลบผ่าน API พื้นฐาน |
| POST | `workload/piline_event_record/input` | บันทึก Event/NG/ไฟล์แนบ |
| PATCH | `workload/piline_event_record/input/:number` | แก้ไข Event/NG/ไฟล์แนบ |
| GET | `workload/piline_event_record/input/:number/files/:type/:seq` | อ่านไฟล์แนบเหตุการณ์ |
| GET | `workload/piline_event_record/idtag/:idtag` | ค้นหา ID Tag และ Material Code |
| GET | `workload/piline_issue/reference` | ตรวจเลขอ้างอิงจาก query `number` |
| GET | `workload/piline_issue/part` | ค้นหาชิ้นงานจาก query `order`, `drawing` |
| POST | `workload/piline_issue/request/prepare` | ตรวจข้อมูลและความพร้อมก่อนสร้างคำขอ |
| POST | `workload/piline_issue/request` | บันทึก Reject Notice และเชื่อมรายการ PI Line |
| POST | `workload/piline_issue/request/files` | อัปโหลดไฟล์แนบ Reject Notice |

## 8. แนวทางดูแลโค้ด

- การแก้การบันทึกครบชุดควรตรวจ Input Controller, Input Service, Files Service และ Save DTO ร่วมกัน
- การแก้ Issue/Reject ควรตรวจ Request, Details, Flow, Files และ Request DTO ร่วมกัน
- Entity ของตารางอยู่ภายนอกโฟลเดอร์นี้ เช่น `src/common/Entities/workload/table` และ `src/common/Entities/webform/table`
- หากจัดโฟลเดอร์ใหม่ ต้องปรับ import และ Module ให้ครบ โดยคงเส้นทาง API เดิมสำหรับ frontend