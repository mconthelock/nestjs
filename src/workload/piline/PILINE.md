# PILINE API

Entity อยู่ใน `src/common/Entities/workload/table/` ใช้ schema `WORKLOAD` และ `workloadConnection` ชื่อตารางใช้ `PILINE_` ทั้งหมด
แต่ละตารางมีโฟลเดอร์ `src/workload/piline_<ชื่อ>/` พร้อม create/update/key DTO, controller, service, repository และ module ซึ่งลงทะเบียนใน `workload.module.ts` แล้ว
ชื่อหลักของไฟล์ใช้ตัวพิมพ์ใหญ่ เช่น `PILINE_CAUSE_MST.controller.ts`, `CREATE-PILINE_CAUSE_MST.dto.ts` และ `PILINE-CRUD.repository.ts`; ส่วน suffix เช่น `.controller.ts` และชื่อโฟลเดอร์คงรูปแบบเดิม

## ตารางและเส้นทาง

ทุกเส้นทางขึ้นต้น `/workload/` ใช้ `POST /<ชื่อเส้นทาง>` เพื่อ insert และ `PATCH` / `DELETE /<ชื่อเส้นทาง>/<key>` เพื่อ update / delete

| ชื่อเส้นทาง         | หน้าที่                                                     | Key ใน URL ตามลำดับ        |
| ------------------- | ----------------------------------------------------------- | -------------------------- |
| piline_cause_mst    | สาเหตุ                                                      | CAUSE_ID                   |
| piline_event_mst    | หมวดหลัก ประเภท และผลกระทบต่อการผลิต                        | EVENT_ID                   |
| piline_initial_mst  | รายละเอียดการดำเนินการเบื้องต้น (ความหมายทางธุรกิจรอยืนยัน) | INITIAL_ID                 |
| piline_location_mst | สถานที่                                                     | LOCATION_ID                |
| piline_problem_mst  | ปัญหา                                                       | PROBLEM_ID                 |
| piline_section_mst  | รหัสแผนก                                                    | SSECCODE                   |
| piline_mapping_mst  | จับคู่สถานที่ + สาเหตุ + ปัญหา กับประเภทเหตุการณ์           | MAP_ID                     |
| piline_event_record | เหตุการณ์จริง วันที่ กะ เวลา รายละเอียด NG และผู้บันทึก     | PILINE_NO                  |
| piline_ng_record    | Tag จำนวน Lot รหัสวัตถุดิบ และหมายเหตุ NG                   | PILINE_NO                  |
| piline_att          | ข้อมูลชื่อไฟล์แนบ ลำดับ ประเภทไฟล์                          | PILINE_NO / SEQ / TYPEFILE |

## รูปแบบการเรียก

```http
POST /workload/piline_cause_mst
Content-Type: application/json

{ "CAUSE_ID": 1, "CAUSE_NAME": "เครื่องจักรขัดข้อง" }
```

```http
PATCH /workload/piline_cause_mst/1
Content-Type: application/json

{ "CAUSE_NAME": "ปรับชื่อสาเหตุ", "STATUS": "0" }
```

```http
PATCH /workload/piline_att/PI000000001/1/jpg
Content-Type: application/json

{ "FILENAME": "updated.jpg" }
```

ลบด้วย `DELETE /workload/piline_cause_mst/1` หรือ `DELETE /workload/piline_att/PI000000001/1/jpg`
ผลสำเร็จเป็น `{ "status": true, "message": "...", "data": { ...primaryKey } }` โดย POST ตอบ 201 และ PATCH/DELETE ตอบ 200

## Validation และการบันทึก

- Body ใช้ชื่อฟิลด์พิมพ์ใหญ่ตาม Entity; POST ต้องส่ง PK เอง เพราะ DDL ไม่มี sequence/identity และใช้ insert จริง จึงไม่เขียนทับรายการเดิมเมื่อ key ซ้ำ
- ส่งตัวเลขใน JSON เป็น number และวันที่เป็นข้อความ ISO 8601 พร้อม timezone ตามที่ระบบใช้งาน; DTO แปลงวันที่เป็น `Date`
- DTO ตรวจ required, ความยาวข้อความ, จำนวนเต็ม/range ตาม precision ใน DDL และ `IS_NG` เฉพาะ `'0'`/`'1'`; ID ที่เป็น NUMBER ใช้จำนวนเต็มในช่วง JavaScript safe integer
- Entity ยังคงรูปแบบคลีน ไม่ใส่ type/length/precision/scale; ขนาดและชนิด Oracle จริงให้ยึด DDL ในฐานข้อมูล
- PATCH รับเฉพาะฟิลด์ที่ส่งมาและไม่เปลี่ยน PK; ฟิลด์ nullable ส่ง `null` เพื่อล้างค่าได้ ส่วน NOT NULL ส่ง `null` ไม่ได้
- ตาม global ValidationPipe ฟิลด์นอก DTO ถูกตัดทิ้ง รวมถึง PK ใน PATCH body; ถ้าไม่เหลือฟิลด์สำหรับแก้ไขจะตอบ 400
- `PILINE_SECTION_MST` มีเฉพาะ PK จึงไม่มีฟิลด์สำหรับ PATCH (ตอบ 400); หากเปลี่ยนรหัสให้สร้างรหัสใหม่และลบรหัสเก่าตามกฎงาน
- ไม่ส่ง `STATUS` / `IS_NG` / `CREATE_DATE` ตอนสร้างจะใช้ default ของฐานข้อมูล `'1'` / `'0'` / `SYSTIMESTAMP`; UPDATE_BY/UPDATE_DATE ต้องส่งเองหากต้องการบันทึกผู้แก้ไขและเวลา
- ทุก mutation ใช้ `UseTransaction('workloadConnection')` และ BaseRepository ของโปรเจกต์; แต่ละ request เป็นหนึ่ง transaction ไม่ได้รวมเหตุการณ์ + NG + ไฟล์แนบหลาย request เป็น transaction เดียว
- 400 = ข้อมูลไม่ถูกต้อง, 404 = update/delete ไม่พบรายการ, 409 = key/unique ซ้ำ หรือผิด FK; ข้อผิดพลาดฐานข้อมูลอื่นส่งต่อระบบจัดการข้อผิดพลาดเดิม
- DELETE เป็นการลบจริง ไม่ cascade และไม่ลบไฟล์จาก storage; API ไฟล์แนบจัดการเฉพาะข้อมูลในตาราง

## ความสัมพันธ์และข้อกำหนดฐานข้อมูล

- Mapping มี FK หลายต่อหนึ่งไป LOCATION, CAUSE, PROBLEM, EVENT master; ชุด LOCATION_ID + CAUSE_ID + PROBLEM_ID ห้ามซ้ำ
- Event Record มี FK ไป LOCATION, CAUSE, PROBLEM, INITIAL master; ไม่มี MAP_ID/EVENT_ID โดยตรง ต้องเทียบชุดสถานที่ + สาเหตุ + ปัญหาเพื่อหาประเภทเหตุการณ์จาก Mapping
- NG ใช้ PILINE_NO เป็นทั้ง PK และ FK ไปเหตุการณ์ จึงมีได้ 0–1 แถวต่อเหตุการณ์; ต้องลบ NG ก่อนลบเหตุการณ์ที่มี NG
- ATT เชื่อมด้วย PILINE_NO ในเชิงการใช้งาน แต่ DDL ไม่มี FK เช่นเดียวกับ SSECCODE และ REF_RN_CYEAR2/REF_RN_NRUNNO ในเหตุการณ์ จึงต้องจัดการความสอดคล้องในขั้นตอนธุรกิจ
- ชื่อ LOCATION/CAUSE/PROBLEM และ INITIAL_DETAIL ห้ามซ้ำในแต่ละ master; EVENT master ห้ามซ้ำในชุด MAIN_CATEGORY + EVENT_TYPE + PRODUCTION_IMPACT
- เหตุการณ์ห้ามซ้ำในชุด EVENT_DATE + RUN_NO โดย Oracle DATE มีส่วนเวลา; IS_NG ไม่ได้บังคับให้ต้องมีแถว NG ผ่าน constraint
- กฎ RECORD_STATUS, เงื่อนไขสร้าง NG/อ้างอิง RN, ความหมาย INITIAL และการจัดการไฟล์แนบเมื่อเหตุการณ์ถูกลบยังไม่ได้กำหนดเพิ่มเติม

## การตรวจสอบ

ทดสอบ HTTP ผ่าน Nest ValidationPipe, controller, service และ repository โดย mock การเขียนฐานข้อมูล ครอบคลุมทั้ง 10 ตาราง รวม composite key, validation และการแปลงข้อผิดพลาด Oracle เป็น HTTP status
ยังไม่ได้ทดสอบ insert/update/delete กับ Oracle จริงหรือเปลี่ยนแปลงข้อมูลจริง

## บันทึกจากหน้า Production Event Record

POST /workload/piline_event_record/input รับ multipart/form-data:
- payload: JSON ของ EVENT_DATE (YYYY-MM-DD), SHIFT (Day/Night), START_TIME/END_TIME (HH:mm), LOCATION_ID, SSECCODE, CAUSE_ID, PROBLEM_ID, INITIAL_ID, DETAIL, IS_NG, CREATE_BY และ REMARK (optional)
- ถ้า IS_NG='1' ต้องมี NG: { ID_TAG, QTY, MAT_LOT, MAT_NO, REMARK_NG? }; ถ้าเป็น '0' ห้ามส่ง NG/ngFiles
- eventFiles/ngFiles: PDF/JPEG/PNG/GIF/WEBP/HEIC รวมไม่เกิน 10 ไฟล์ ไฟล์ละ 5 MB ตรวจ signature ฝั่ง server
- ตรวจ master และ Mapping ว่ายังใช้งานอยู่; client ห้ามส่ง PILINE_NO/RUN_NO/CREATE_DATE
- เลข PIYYMM001 รันตามเดือนของ EVENT_DATE จากเลขสูงสุดที่ยังอยู่; RUN_NO รันรายวัน จำกัดทั้งสองค่าที่ 999 (เต็มตอบ 409) เวลาประเทศไทยและรองรับข้ามเที่ยงคืน
- Oracle ล็อกตารางก่อนอ่านเลขและเขียน; MySQL ใช้ advisory lock จน commit ป้องกันการชนกันของ endpoint นี้
- EVENT_RECORD + NG_RECORD + ATT บันทึกใน transaction เดียว ไฟล์เขียนก่อนเข้า transaction และลบทิ้งหากล้มเหลวก่อน commit
- ถ้าขาดการเชื่อมต่อระหว่าง commit จะเก็บไฟล์ไว้และตอบ 503 ให้ตรวจรายการก่อนส่งซ้ำ เพราะผล commit อาจไม่แน่นอน
- TYPEFILE เป็น EVT/NG, FILENAME เป็น relative path ภายในโฟลเดอร์ upload; SEQ เรียงตามไฟล์
- ตั้ง PILINE_UPLOAD_DIR ได้; default ใช้ AMEC_FILE_PATH/STATE/piline หรือ public/uploads/piline ถ้าไม่มี AMEC_FILE_PATH
- ไม่กำหนด RECORD_STATUS เพิ่มเอง; แบบร่างบนหน้าจอยังเก็บในเครื่อง
- สำเร็จตอบ 201 { status: true, data: { PILINE_NO, RUN_NO, ...record, attachments } }; endpoint เดิมยังใช้งานได้

GET master และ EVENT_RECORD รองรับ dropdown/รายการล่าสุด 200 แถว เรียง EVENT_DATE/RUN_NO จากใหม่ไปเก่า
ทดสอบ API 97 เคสโดยจำลองฐานข้อมูลและ disk รวม rollback, file validation, เลขรัน, NG, locks และ commit ไม่แน่นอน ยังไม่ทดสอบกับ Oracle จริง

GET piline_section_mst เชื่อมผลกับ PSECTION จาก amecConnection ด้วย SSECCODE (trim ช่องว่าง) ส่ง SSEC สำหรับแสดงชื่อ และ SSECCODE สำหรับบันทึก; ถ้าไม่พบชื่อจะแสดงรหัสแทน โดยไม่ตัดรายการออก

NG lookup: GET /workload/piline_event_record/idtag/:idtag ตัด whitespace และตรวจความยาว 11 ตัว ค้น AMECMFG.F110KP WHERE F11K01 = :idtag; ส่ง F11K04/05/06/11/15/16/18 ให้ frontend, ไม่พบตอบ 404. ชื่อฟิลด์จริงใช้ prefix F11K ไม่ใช่ F1K

ฟังก์ชันค้น ID Tag อยู่เฉพาะใน PILINE_IDTAG.controller.ts ของ PILINE ใช้ Entity F110KP แบบอ่านอย่างเดียว คืน f110kp.controller.ts และ f110kp.service.ts เป็นเดิม ห้ามแก้ไฟล์ F110KP ของระบบอื่น

## Material Code ผ่าน Private DB Link
- รัน `PILINE_PIIS_LINK.sql` ด้วย user จริงของ `workloadConnection` เพียงครั้งเดียว ผ่าน SQL*Plus/SQLcl หรือ SQL Developer Run Script; กรอกรหัสผ่าน PIISUSER เมื่อ script ถาม ไม่เก็บรหัสผ่านใน repository
- Link ชื่อ `PILINE_PIIS_LINK` ไป Oracle 172.21.255.223:1521 ใช้ SERVICE_NAME `orcl.MitsubishiElevatorAsia.co.th`; ไม่เพิ่ม connection/entity และไม่แก้ F110KP
- ผู้รันต้องมี CREATE DATABASE LINK; PIISUSER ต้องมี SELECT บน AMEC.F_D011_PROCESS_SCHEDULES และเครื่อง Oracle ต้นทางต้องเข้าถึงปลายทางได้
- ชื่อ link นี้ใช้เมื่อ GLOBAL_NAMES=FALSE; ถ้าเป็น TRUE ให้ DBA เลือกชื่อตาม remote global name และแก้ query PILINE ให้ตรงกัน ไม่เปลี่ยนค่าฐานข้อมูลส่วนกลางเอง
- GET `/workload/piline_event_record/idtag/:idtag` อ่าน F110KP ก่อน แล้ว trim F11K04 และตัด `-`; ค้น DISTINCT MATERIAL_ID ด้วย SHEAR_NC LIKE order-prefix ผ่าน workloadConnection ใช้ bind parameter และ escape wildcard ก่อนเติม `%`
- Response เดิม `data` คงอยู่ เพิ่ม `materialCodes: string[]`; ไม่พบรหัสคืน array ว่าง; link ใช้ไม่ได้คืน 503 (ไม่ปลอมเป็นไม่พบ ID Tag); MySQL ไม่รองรับ link นี้
- Frontend แสดง dropdown Material Code ปิดไว้ก่อนค้นหา/เมื่อเปลี่ยน ID Tag เปิดเมื่อมีตัวเลือก เรียงชื่อ และต้องเลือกก่อนบันทึก NG; ค่าที่เลือกส่งเป็น MAT_NO ตามเดิม
- ผู้ใช้ติดตั้ง link แล้ว; ตรวจจริง 2026-10-12 ด้วย WORKLOAD พบ PILINE_PIIS_LINK และอ่านตารางปลายทางได้ รวมทั้งเรียก GET API ที่ frontend ใช้งานอยู่ได้ HTTP 200 พร้อม materialCodes 3 ค่า จาก ID Tag ตัวอย่างในรายการเดิม การตรวจนี้อ่านอย่างเดียว ไม่ได้ทดสอบบันทึก NG
- อ้างอิง Oracle: https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/CREATE-DATABASE-LINK.html

## รายการ Production Event Record (2026-10-13)
- GET รายการใช้ LEFT JOIN PILINE_NG_RECORD ด้วย PILINE_NO ส่งเป็น NG; ไม่ตัดรายการที่ไม่มี NG; ยกเลิก take 200 เพื่อค้นหา/export ครบรายการ
- CREATE_BY/UPDATE_BY จับคู่ AMECUSERALL.SEMPNO แล้วส่ง CREATE_BY_NAME/UPDATE_BY_NAME จาก SNAME; เนื่องจากคนละ connection จึงใช้ batch lookup และ merge แบบ left join ไม่กรองแถวที่หา user ไม่พบ
- อ่านข้อมูลชิ้นงาน F110KP ด้วย NG.ID_TAG แบบ batch ผ่าน amecConnection (ไม่แก้ไฟล์ F110KP); ส่ง JUN/P/ORDER_NO/ITEM/PART_NAME/DRAWING/MATERIAL/THICKNESS ตาม mapping เดิม; Protective sheet ยังไม่มีต้นทาง
- MAT_LOT ใน input DTO เป็น optional รับค่าว่างได้; frontend ซ่อนปุ่มแบบร่างและแสดงตาราง 25 คอลัมน์พร้อมกรอง/เรียงเมื่อ Search และ export XLSX ทุกแถวที่ผ่านตัวกรอง
- TypeScript ผ่าน; browser ทดสอบข้อมูลจำลองผ่าน ไม่ได้ทดสอบเขียนฐานข้อมูล และ GET API รอบนี้เชื่อมต่อไม่ได้

## ACTIVE / DELETE / Edit input (2026-10-13)
- POST input และ POST CRUD รายการใหม่ตั้ง RECORD_STATUS=ACTIVE จาก server; PIYYMM### อ้าง EVENT_DATE ที่ผู้ใช้เลือก (คงวิธีเดิม ไม่ใช้วัน CREATE_DATE)
- GET รายการใช้ WHERE event.RECORD_STATUS <> 'DELETE' โดยตรง จึงไม่คืน NULL เช่นกัน ไม่มีการแก้ข้อมูลเก่าหรือ backfill
- เพิ่ม PATCH input/:number ใช้ multipart validation/transaction และ lock เดียวกับ create; โหลดแถวปัจจุบันจาก DB, ปฏิเสธ DELETE และ IS_NG=1 + QC_REJECT ก่อนเขียน
- ล็อก EVENT_DATE เปรียบเทียบวันเขต Asia/Bangkok และคง PILINE_NO/RUN_NO/CREATE_BY/CREATE_DATE/RECORD_STATUS/Ref เดิม; ผู้ใช้ปัจจุบันใน payload CREATE_BY บันทึกเป็น UPDATE_BY แทน และ UPDATE_DATE จาก server
- ข้อมูลอัตโนมัติไม่อยู่ใน whitelist DTO; update NG ใน transaction เดียวกัน (เมื่อไม่พบ NG ลบแถว NG เดิม) เก็บ ATT เดิมและเพิ่มไฟล์ใหม่โดยเลื่อน SEQ ไม่ชน รวมไม่เกิน 10 ไฟล์
- Frontend เพิ่ม Ref และ Action, ล็อกวัน/readonly, คงไฟล์เดิม; freeze 2 คอลัมน์, paging นอก scroll และ datepicker Filter d/m/Y
- ตรวจ API mock ผ่าน 32 cases รวม edit/date lock/QC_REJECT/DELETE/attachment append/ACTIVE/date-based numbering; frontend browser fixture ผ่าน ไม่ได้เขียนข้อมูล Oracle จริง

## แสดงรายการเดิมที่สถานะว่าง
- แก้ GET ให้ใช้ (RECORD_STATUS IS NULL OR RECORD_STATUS <> 'DELETE') เพื่อแสดงรายการเดิมที่ยังไม่มีสถานะ ซ่อนเฉพาะ DELETE โดยไม่แก้ข้อมูลจริง

## ที่เก็บไฟล์ตาม PI Line Number
- ใช้ PILINE_FILE_PATH เป็นลำดับแรก; fallback PILINE_UPLOAD_DIR/AMEC_FILE_PATH ตามเดิม
- สร้างไฟล์หลังออกเลข PI ภายใน transaction ที่ lock แล้ว: <root>/<PILINE_NO>/<SEQ>-<ชื่อเดิม>-<UUID>.<ext> ใช้ UUID ในชื่อเพื่อไม่ชนไฟล์เดิม ไม่สร้างโฟลเดอร์ UUID
- ATT.FILENAME เก็บ <PILINE_NO>/<ชื่อไฟล์>; แนบเพิ่มใช้โฟลเดอร์เดิมและลำดับถัดไป
- Rollback ลบเฉพาะไฟล์ของรอบนั้น ไม่ลบทั้งโฟลเดอร์ จึงไม่กระทบไฟล์เก่า; กรณี commit ไม่ทราบผลยังเก็บไฟล์ไว้ตรวจสอบ
- ไฟล์เก่าไม่ได้ย้ายตาม path ใหม่ ต้อง restart API ให้โหลด environment ใหม่; ทดสอบด้วย mock ไม่ได้เขียน NAS จริง

- SEQ ไฟล์แยกตาม PILINE_NO + TYPEFILE: EVT และ NG เริ่ม 1 แยกกัน; แนบเพิ่มต่อจาก MAX(SEQ) ของประเภทนั้นเท่านั้น ไม่เรียงเลขใหม่ให้ไฟล์เก่า

## รูปแบบเลข PI ที่แก้ไขล่าสุด
- รายการใหม่ใช้ PIYYMMDD### รวม 11 ตัว เช่น PI261012001 จาก EVENT_DATE 2026-10-12 และ RUN_NO=1
- ใช้ MAX(RUN_NO)+1 ของ EVENT_DATE ภายใต้ lock เดิม เริ่มใหม่ในวันที่ยังไม่มีรายการ จำกัด 999 ต่อวัน; เลขรันรวมรายการเดิม/DELETE เพื่อไม่ใช้เลขซ้ำ
- ไม่เปลี่ยนเลข/โฟลเดอร์ของรายการเก่า; เวลาแนบไฟล์รองรับทั้งเลขเก่า 9 ตัวและเลขใหม่ 11 ตัว

## ลบไฟล์แนบในหน้าแก้ไข
- GET leftJoinAndMapMany ATT ตาม PILINE_NO เพื่อแสดงไฟล์เดิม
- Input DTO เพิ่ม DELETE_FILES?: {TYPEFILE: EVT|NG, SEQ: number}[] สูงสุด 10; รับเฉพาะโหมดแก้ไข และทุก key ต้องมีอยู่ในรายการปัจจุบัน มิฉะนั้น 409
- ลบ ATT ใน transaction เดียวกับแก้ไข ตรวจจำนวน retained+new ไม่เกิน 10 และยังนับ SEQ แยก type จากลำดับเดิม
- ลบไฟล์จริงหลัง commit ด้วย path จาก DB ที่อยู่ใต้ upload root เท่านั้น ไม่รับ path จาก client; rollback/commit ไม่ทราบผลไม่ลบไฟล์เดิม; ลบจริงไม่สำเร็จส่ง warning และ log โดยไม่รายงานว่าบันทึกล้มเหลว
- ไม่ย้าย/ลบไฟล์ legacy ข้าม root โดยอัตโนมัติ; ผู้ดูแลต้องจัดการไฟล์ที่ยังอยู่ path เก่าเอง
- API mock 41 กรณีผ่าน รวมลบตาม type+seq, ป้องกันไฟล์ต่างรายการ และคงไฟล์เมื่อ rollback ไม่ได้ลบ NAS จริง

## ดูไฟล์แนบเดิม
- GET /workload/piline_event_record/input/:number/files/:type/:seq ตรวจเลข PI/TYPEFILE/SEQ และค้น ATT ของรายการนั้นก่อนอ่านไฟล์ ไม่รับ path จาก client
- จำกัด path อยู่ใต้ upload root ใช้ชนิดไฟล์จาก signature และส่ง StreamableFile พร้อม private/no-store และ nosniff; ไฟล์ไม่พบคืน 404
- Frontend แสดงปุ่มดูไฟล์ในแถวเล็กของโซนอัปโหลด EVT/NG ใช้ preview รูป/PDF และดาวน์โหลดของเดิม
- API mock 44 tests และ frontend preview fixture ผ่าน ไม่ได้อ่าน/เขียน NAS จริง
