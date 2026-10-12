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
