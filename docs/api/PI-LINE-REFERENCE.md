# PI-LINE — Endpoint และ DTO reference

อ้างอิง source วันที่ 22/10/2026; อ่านคู่มือหลักสำหรับ business rules และตัวอย่าง JSON

## Endpoint ทั้งหมด

Path ต่อท้าย {{BASE_URL}}; :name คือ path parameter; Body=JSON เว้น endpoint multipart ที่อธิบายในคู่มือหลัก

| Method | Path | Input / DTO | Handler |
|---|---|---|---|
| POST | `/workload/piline_att` | Body(): CreatePilineAttDto | PilineAttController.create |
| PATCH | `/workload/piline_att/:PILINE_NO/:SEQ/:TYPEFILE` | Param(): KeyPilineAttDto; Body(): UpdatePilineAttDto | PilineAttController.update |
| DELETE | `/workload/piline_att/:PILINE_NO/:SEQ/:TYPEFILE` | Param(): KeyPilineAttDto | PilineAttController.remove |
| GET | `/workload/piline_bending_att` | ไม่มี body/query | PilineBendingAttController.findAll |
| GET | `/workload/piline_bending_att/:idtag` | Param('idtag'): string | PilineBendingAttController.findOne |
| POST | `/workload/piline_bending_att/search` | Body(): FiltersDto | PilineBendingAttController.search |
| POST | `/workload/piline_bending_att` | Body(): piline_bending_att | PilineBendingAttController.create |
| GET | `/workload/piline_bending_main` | ไม่มี body/query | PilineBendingMainController.findAll |
| GET | `/workload/piline_bending_main/:IDTAG` | Param('IDTAG'): string | PilineBendingMainController.findOne |
| POST | `/workload/piline_bending_main/search` | Body(): FiltersDto | PilineBendingMainController.search |
| POST | `/workload/piline_bending_main` | Body(): CreatePilineBendingMainDto | PilineBendingMainController.create |
| GET | `/workload/piline_cause_mst` | ไม่มี body/query | PilineCauseMstController.findAll |
| POST | `/workload/piline_cause_mst` | Body(): CreatePilineCauseMstDto | PilineCauseMstController.create |
| PATCH | `/workload/piline_cause_mst/:CAUSE_ID` | Param(): KeyPilineCauseMstDto; Body(): UpdatePilineCauseMstDto | PilineCauseMstController.update |
| DELETE | `/workload/piline_cause_mst/:CAUSE_ID` | Param(): KeyPilineCauseMstDto | PilineCauseMstController.remove |
| GET | `/workload/piline_event_mst` | ไม่มี body/query | PilineEventMstController.findAll |
| POST | `/workload/piline_event_mst` | Body(): CreatePilineEventMstDto | PilineEventMstController.create |
| PATCH | `/workload/piline_event_mst/:EVENT_ID` | Param(): KeyPilineEventMstDto; Body(): UpdatePilineEventMstDto | PilineEventMstController.update |
| DELETE | `/workload/piline_event_mst/:EVENT_ID` | Param(): KeyPilineEventMstDto | PilineEventMstController.remove |
| GET | `/workload/piline_event_record/input/:number/files/:type/:seq` | Param('number'): string; Param('type'): string; Param('seq'): string | PilineEventInputController.preview |
| POST | `/workload/piline_event_record/input` | Body(): PilineInputMultipartDto; UploadedFiles(): PilineInputFiles | PilineEventInputController.save |
| PATCH | `/workload/piline_event_record/input/:number` | Param('number'): string; Body(): PilineInputMultipartDto; UploadedFiles(): PilineInputFiles | PilineEventInputController.edit |
| GET | `/workload/piline_event_record` | ไม่มี body/query | PilineEventRecordController.findAll |
| GET | `/workload/piline_event_record/issue` | ไม่มี body/query | PilineEventRecordController.findIssues |
| POST | `/workload/piline_event_record` | Body(): CreatePilineEventRecordDto | PilineEventRecordController.create |
| PATCH | `/workload/piline_event_record/:PILINE_NO` | Param(): KeyPilineEventRecordDto; Body(): UpdatePilineEventRecordDto | PilineEventRecordController.update |
| DELETE | `/workload/piline_event_record/:PILINE_NO` | Param(): KeyPilineEventRecordDto | PilineEventRecordController.remove |
| GET | `/workload/piline_event_record/idtag/:idtag` | Param('idtag'): string | PilineIdtagController.findByIdTag |
| GET | `/workload/piline_issue/reference` | Query('number'): string | PilineIssueController.checkReference |
| GET | `/workload/piline_issue/part` | Query('order'): string; Query('drawing'): string | PilineIssueController.findPart |
| POST | `/workload/piline_issue/request/files` | Body(): RejectFilesMultipartDto; UploadedFiles(): Express.Multer.File[] | PilineRejectFilesController.upload |
| POST | `/workload/piline_issue/request/prepare` | Body(): PilineRejectRequestDto | PilineRejectRequestController.prepare |
| POST | `/workload/piline_issue/request` | Body(): SavePilineRejectDto | PilineRejectRequestController.save |
| GET | `/workload/piline_initial_mst` | ไม่มี body/query | PilineInitialMstController.findAll |
| POST | `/workload/piline_initial_mst` | Body(): CreatePilineInitialMstDto | PilineInitialMstController.create |
| PATCH | `/workload/piline_initial_mst/:INITIAL_ID` | Param(): KeyPilineInitialMstDto; Body(): UpdatePilineInitialMstDto | PilineInitialMstController.update |
| DELETE | `/workload/piline_initial_mst/:INITIAL_ID` | Param(): KeyPilineInitialMstDto | PilineInitialMstController.remove |
| GET | `/workload/piline_location_mst` | ไม่มี body/query | PilineLocationMstController.findAll |
| POST | `/workload/piline_location_mst` | Body(): CreatePilineLocationMstDto | PilineLocationMstController.create |
| PATCH | `/workload/piline_location_mst/:LOCATION_ID` | Param(): KeyPilineLocationMstDto; Body(): UpdatePilineLocationMstDto | PilineLocationMstController.update |
| DELETE | `/workload/piline_location_mst/:LOCATION_ID` | Param(): KeyPilineLocationMstDto | PilineLocationMstController.remove |
| GET | `/workload/piline_mapping_mst` | ไม่มี body/query | PilineMappingMstController.findAll |
| POST | `/workload/piline_mapping_mst` | Body(): CreatePilineMappingMstDto | PilineMappingMstController.create |
| PATCH | `/workload/piline_mapping_mst/:MAP_ID` | Param(): KeyPilineMappingMstDto; Body(): UpdatePilineMappingMstDto | PilineMappingMstController.update |
| DELETE | `/workload/piline_mapping_mst/:MAP_ID` | Param(): KeyPilineMappingMstDto | PilineMappingMstController.remove |
| GET | `/workload/piline_master_management/:kind` | Param('kind'): string | PilineMasterManagementController.list |
| POST | `/workload/piline_master_management/:kind` | Param('kind'): string; Body(): Record&lt;string,unknown&gt; | PilineMasterManagementController.create |
| PATCH | `/workload/piline_master_management/:kind/:id` | Param('kind'): string; Param('id'): number; Body(): Record&lt;string,unknown&gt; | PilineMasterManagementController.update |
| DELETE | `/workload/piline_master_management/:kind/:id` | Param('kind'): string; Param('id'): number | PilineMasterManagementController.remove |
| POST | `/workload/piline_ng_record` | Body(): CreatePilineNgRecordDto | PilineNgRecordController.create |
| PATCH | `/workload/piline_ng_record/:PILINE_NO` | Param(): KeyPilineNgRecordDto; Body(): UpdatePilineNgRecordDto | PilineNgRecordController.update |
| DELETE | `/workload/piline_ng_record/:PILINE_NO` | Param(): KeyPilineNgRecordDto | PilineNgRecordController.remove |
| GET | `/workload/piline_problem_mst` | ไม่มี body/query | PilineProblemMstController.findAll |
| POST | `/workload/piline_problem_mst` | Body(): CreatePilineProblemMstDto | PilineProblemMstController.create |
| PATCH | `/workload/piline_problem_mst/:PROBLEM_ID` | Param(): KeyPilineProblemMstDto; Body(): UpdatePilineProblemMstDto | PilineProblemMstController.update |
| DELETE | `/workload/piline_problem_mst/:PROBLEM_ID` | Param(): KeyPilineProblemMstDto | PilineProblemMstController.remove |
| GET | `/workload/piline_section_mst` | ไม่มี body/query | PilineSectionMstController.findAll |
| POST | `/workload/piline_section_mst` | Body(): CreatePilineSectionMstDto | PilineSectionMstController.create |
| PATCH | `/workload/piline_section_mst/:SSECCODE` | Param(): KeyPilineSectionMstDto; Body(): UpdatePilineSectionMstDto | PilineSectionMstController.update |
| DELETE | `/workload/piline_section_mst/:SSECCODE` | Param(): KeyPilineSectionMstDto | PilineSectionMstController.remove |

รวม 60 routes จาก controller ในขอบเขตนี้ ไม่ได้นับ service method ภายในที่ไม่มี HTTP route

## DTO และข้อกำหนด field

เครื่องหมาย optional อ้าง TypeScript/IsOptional/ValidateIf ให้ดู decorators ร่วมด้วย เพราะเงื่อนไข service อาจบังคับเพิ่ม เช่น START_USE_DATE ของ CREATE

PartialType ทำให้ช่องที่รับต่อมาเป็น optional; OmitType ตัดชื่อช่องตามรายการ; PickType เลือกเฉพาะช่อง; IntersectionType รวมช่องของทุก class อ้างตาราง class ต้นทางด้านล่างประกอบกัน

### CreatePilineAttDto

Source: `src/workload/piline_att/dto/CREATE-PILINE_ATT.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| PILINE_NO | string | ไม่ | @IsString() @MaxLength(11) @Matches(/\S/, { message: '$property must not be blank' }) |
| SEQ | number | ไม่ | @IsInt() @Min(-99) @Max(99) |
| FILENAME | string | ไม่ | @IsString() @MaxLength(300) @Matches(/\S/, { message: '$property must not be blank' }) |
| TYPEFILE | string | ไม่ | @IsString() @MaxLength(4) @Matches(/\S/, { message: '$property must not be blank' }) |

### KeyPilineAttDto

Source: `src/workload/piline_att/dto/KEY-PILINE_ATT.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| PILINE_NO | string | ไม่ | @IsString() @MaxLength(11) @Matches(/\S/, { message: '$property must not be blank' }) |
| SEQ | number | ไม่ | @IsInt() @Min(-99) @Max(99) @Transform(({ value }) =&gt; typeof value === 'string' &amp;&amp; /^-?\d+$/.test(value) ? Number(value) : value, ) |
| TYPEFILE | string | ไม่ | @IsString() @MaxLength(4) @Matches(/\S/, { message: '$property must not be blank' }) |

### UpdatePilineAttDto

Source: `src/workload/piline_att/dto/UPDATE-PILINE_ATT.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| FILENAME | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(300) @Matches(/\S/, { message: '$property must not be blank' }) |

### CreatePilineBendingAttDto

Source: `src/workload/piline_bending_att/dto/create-piline_bending_att.dto.ts`

ไม่มี field ประกาศเพิ่มเอง ดู base class ด้านบน (ถ้ามี)

### UpdatePilineBendingAttDto

Source: `src/workload/piline_bending_att/dto/update-piline_bending_att.dto.ts`

รับ field เพิ่มตามนิยาม:

```typescript
extends PartialType(CreatePilineBendingAttDto)
```

ไม่มี field ประกาศเพิ่มเอง ดู base class ด้านบน (ถ้ามี)

### CreatePilineBendingMainDto

Source: `src/workload/piline_bending_main/dto/create_piline_bending_main.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| IDTAG | string | ไม่ | @IsNotEmpty() @IsString() |
| TYPE | string | ใช่ | @IsOptional() @IsString() |
| SHEET_COLOR | string | ใช่ | @IsOptional() @IsString() |
| ITEM | string | ใช่ | @IsOptional() @IsString() |
| AT | number | ใช่ | @IsOptional() @Type(() =&gt; Number) @IsNumber() |
| BT | number | ใช่ | @IsOptional() @Type(() =&gt; Number) @IsNumber() |
| AM | number | ใช่ | @IsOptional() @Type(() =&gt; Number) @IsNumber() |
| BM | number | ใช่ | @IsOptional() @Type(() =&gt; Number) @IsNumber() |
| AL | number | ใช่ | @IsOptional() @Type(() =&gt; Number) @IsNumber() |
| BL | number | ใช่ | @IsOptional() @Type(() =&gt; Number) @IsNumber() |
| TA1 | number | ใช่ | @IsOptional() @Type(() =&gt; Number) @IsNumber() |
| TA2 | number | ใช่ | @IsOptional() @Type(() =&gt; Number) @IsNumber() |
| TA3 | number | ใช่ | @IsOptional() @Type(() =&gt; Number) @IsNumber() |
| TA4 | number | ใช่ | @IsOptional() @Type(() =&gt; Number) @IsNumber() |
| TB1 | number | ใช่ | @IsOptional() @Type(() =&gt; Number) @IsNumber() |
| TB2 | number | ใช่ | @IsOptional() @Type(() =&gt; Number) @IsNumber() |
| TB3 | number | ใช่ | @IsOptional() @Type(() =&gt; Number) @IsNumber() |
| TB4 | number | ใช่ | @IsOptional() @Type(() =&gt; Number) @IsNumber() |
| RECORD_DATE | Date | ใช่ | @IsOptional() @Type(() =&gt; Date) |
| RECORD_BY | string | ใช่ | @IsOptional() @IsString() |

### CreatePilineCauseMstDto

Source: `src/workload/piline_cause_mst/dto/CREATE-PILINE_CAUSE_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| CAUSE_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| CAUSE_NAME | string | ไม่ | @IsString() @MaxLength(300) @Matches(/\S/, { message: '$property must not be blank' }) |
| STATUS | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(1) @Matches(/\S/, { message: '$property must not be blank' }) |

### KeyPilineCauseMstDto

Source: `src/workload/piline_cause_mst/dto/KEY-PILINE_CAUSE_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| CAUSE_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) @Transform(({ value }) =&gt; typeof value === 'string' &amp;&amp; /^-?\d+$/.test(value) ? Number(value) : value, ) |

### UpdatePilineCauseMstDto

Source: `src/workload/piline_cause_mst/dto/UPDATE-PILINE_CAUSE_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| CAUSE_NAME | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(300) @Matches(/\S/, { message: '$property must not be blank' }) |
| STATUS | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(1) @Matches(/\S/, { message: '$property must not be blank' }) |

### CreatePilineEventMstDto

Source: `src/workload/piline_event_mst/dto/CREATE-PILINE_EVENT_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| EVENT_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| MAIN_CATEGORY | string | ไม่ | @IsString() @MaxLength(100) @Matches(/\S/, { message: '$property must not be blank' }) |
| EVENT_TYPE | string | ไม่ | @IsString() @MaxLength(100) @Matches(/\S/, { message: '$property must not be blank' }) |
| PRODUCTION_IMPACT | string | ไม่ | @IsString() @MaxLength(100) @Matches(/\S/, { message: '$property must not be blank' }) |
| STATUS | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(1) @Matches(/\S/, { message: '$property must not be blank' }) |

### KeyPilineEventMstDto

Source: `src/workload/piline_event_mst/dto/KEY-PILINE_EVENT_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| EVENT_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) @Transform(({ value }) =&gt; typeof value === 'string' &amp;&amp; /^-?\d+$/.test(value) ? Number(value) : value, ) |

### UpdatePilineEventMstDto

Source: `src/workload/piline_event_mst/dto/UPDATE-PILINE_EVENT_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| MAIN_CATEGORY | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(100) @Matches(/\S/, { message: '$property must not be blank' }) |
| EVENT_TYPE | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(100) @Matches(/\S/, { message: '$property must not be blank' }) |
| PRODUCTION_IMPACT | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(100) @Matches(/\S/, { message: '$property must not be blank' }) |
| STATUS | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(1) @Matches(/\S/, { message: '$property must not be blank' }) |

### CreatePilineEventRecordDto

Source: `src/workload/piline_event_record/dto/CREATE-PILINE_EVENT_RECORD.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| PILINE_NO | string | ไม่ | @IsString() @MaxLength(11) @Matches(/\S/, { message: '$property must not be blank' }) |
| EVENT_DATE | Date | ไม่ | @Type(() =&gt; Date) @IsDate() |
| RUN_NO | number | ไม่ | @IsInt() @Min(-999) @Max(999) |
| SHIFT | string | ไม่ | @IsString() @MaxLength(10) @Matches(/\S/, { message: '$property must not be blank' }) |
| START_TIME | Date | ไม่ | @Type(() =&gt; Date) @IsDate() |
| END_TIME | Date | ไม่ | @Type(() =&gt; Date) @IsDate() |
| LOCATION_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| SSECCODE | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(6) |
| CAUSE_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| PROBLEM_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| INITIAL_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| DETAIL | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(1000) |
| IS_NG | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(1) @Matches(/\S/, { message: '$property must not be blank' }) @IsIn(['0', '1']) |
| REF_RN_CYEAR2 | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(4) |
| REF_RN_NRUNNO | number &#124; null | ใช่ | @IsOptional() @IsInt() @Min(-999999) @Max(999999) |
| REMARK | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(1000) |
| RECORD_STATUS | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(20) |
| CREATE_BY | string | ไม่ | @IsString() @MaxLength(6) @Matches(/\S/, { message: '$property must not be blank' }) |
| CREATE_DATE | Date | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @Type(() =&gt; Date) @IsDate() |
| UPDATE_BY | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(6) |
| UPDATE_DATE | Date &#124; null | ใช่ | @IsOptional() @Type(() =&gt; Date) @IsDate() |

### KeyPilineEventRecordDto

Source: `src/workload/piline_event_record/dto/KEY-PILINE_EVENT_RECORD.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| PILINE_NO | string | ไม่ | @IsString() @MaxLength(11) @Matches(/\S/, { message: '$property must not be blank' }) |

### PilineInputNgDto

Source: `src/workload/piline_event_record/dto/SAVE-PILINE_EVENT_INPUT.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| ID_TAG | string | ไม่ | @IsString() @Matches(/\S/) @MaxLength(20) |
| QTY | number | ไม่ | @IsInt() @Min(1) @Max(999) |
| MAT_LOT | string | ใช่ | @IsOptional() @IsString() @MaxLength(20) |
| MAT_NO | string | ไม่ | @IsString() @Matches(/\S/) @MaxLength(20) |
| REMARK_NG | string | ใช่ | @IsOptional() @IsString() @MaxLength(1000) |

### PilineDeleteFileDto

Source: `src/workload/piline_event_record/dto/SAVE-PILINE_EVENT_INPUT.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| TYPEFILE | string | ไม่ | @IsIn(['EVT','NG']) |
| SEQ | number | ไม่ | @IsInt() @Min(1) @Max(999) |

### SavePilineEventInputDto

Source: `src/workload/piline_event_record/dto/SAVE-PILINE_EVENT_INPUT.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| DELETE_FILES | PilineDeleteFileDto[] | ใช่ | @IsOptional() @IsArray() @ArrayMaxSize(10) @ValidateNested({ each: true }) @Type(() =&gt; PilineDeleteFileDto) |
| EVENT_DATE | string | ไม่ | @Matches(/^\d{4}-\d{2}-\d{2}$/) @IsDateString({ strict: true }) |
| SHIFT | string | ไม่ | @IsIn(['Day', 'Night']) |
| START_TIME | string | ไม่ | @Matches(/^(?:[01]\d&#124;2[0-3]):[0-5]\d$/) |
| END_TIME | string | ไม่ | @Matches(/^(?:[01]\d&#124;2[0-3]):[0-5]\d$/) |
| LOCATION_ID | number | ไม่ | @IsInt() @Min(0) @Max(Number.MAX_SAFE_INTEGER) |
| SSECCODE | string | ไม่ | @IsString() @Matches(/\S/) @MaxLength(6) |
| CAUSE_ID | number | ไม่ | @IsInt() @Min(0) @Max(Number.MAX_SAFE_INTEGER) |
| PROBLEM_ID | number | ไม่ | @IsInt() @Min(0) @Max(Number.MAX_SAFE_INTEGER) |
| INITIAL_ID | number | ไม่ | @IsInt() @Min(0) @Max(Number.MAX_SAFE_INTEGER) |
| DETAIL | string | ไม่ | @IsString() @Matches(/\S/) @MaxLength(1000) |
| IS_NG | string | ไม่ | @IsIn(['0', '1']) |
| REMARK | string | ใช่ | @IsOptional() @IsString() @MaxLength(1000) |
| CREATE_BY | string | ไม่ | @IsString() @Matches(/\S/) @MaxLength(6) |
| NG | PilineInputNgDto | ใช่ | @IsOptional() @IsObject() @ValidateNested() @Type(() =&gt; PilineInputNgDto) |

### PilineInputMultipartDto

Source: `src/workload/piline_event_record/dto/SAVE-PILINE_EVENT_INPUT.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| payload | string | ไม่ | @IsDefined() @IsString() @MaxLength(65536) |

### UpdatePilineEventRecordDto

Source: `src/workload/piline_event_record/dto/UPDATE-PILINE_EVENT_RECORD.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| EVENT_DATE | Date | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @Type(() =&gt; Date) @IsDate() |
| RUN_NO | number | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsInt() @Min(-999) @Max(999) |
| SHIFT | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(10) @Matches(/\S/, { message: '$property must not be blank' }) |
| START_TIME | Date | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @Type(() =&gt; Date) @IsDate() |
| END_TIME | Date | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @Type(() =&gt; Date) @IsDate() |
| LOCATION_ID | number | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| SSECCODE | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(6) |
| CAUSE_ID | number | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| PROBLEM_ID | number | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| INITIAL_ID | number | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| DETAIL | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(1000) |
| IS_NG | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(1) @Matches(/\S/, { message: '$property must not be blank' }) @IsIn(['0', '1']) |
| REF_RN_CYEAR2 | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(4) |
| REF_RN_NRUNNO | number &#124; null | ใช่ | @IsOptional() @IsInt() @Min(-999999) @Max(999999) |
| REMARK | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(1000) |
| RECORD_STATUS | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(20) |
| CREATE_BY | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(6) @Matches(/\S/, { message: '$property must not be blank' }) |
| CREATE_DATE | Date | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @Type(() =&gt; Date) @IsDate() |
| UPDATE_BY | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(6) |
| UPDATE_DATE | Date &#124; null | ใช่ | @IsOptional() @Type(() =&gt; Date) @IsDate() |

### RejectFilesMultipartDto

Source: `src/workload/piline_event_record/PILINE_REJECT_FILES.controller.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| payload | string | ไม่ | @IsString() |

### PilineRejectPartDto

Source: `src/workload/piline_event_record/PILINE_REJECT_REQUEST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| PILINE_NO | string | ไม่ | @IsString() @Matches(/^PI(?:\d{7}&#124;\d{9})$/) |
| QTY | number | ไม่ | @IsInt() @Min(1) |
| REFNO | string | ใช่ | @IsOptional() @IsString() @Matches(/^(?:(?:CN&#124;PT&#124;RQ)\d{2}-\d{6})?$/) |

### PilineRejectRequestDto

Source: `src/workload/piline_event_record/PILINE_REJECT_REQUEST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| REQUESTER | string | ไม่ | @IsString() @Matches(/^\d{5}$/) |
| INPUTBY | string | ไม่ | @IsString() @Matches(/^\d{5}$/) |
| TID | number | ไม่ | @IsInt() @Min(1) |
| SECCODE | string | ไม่ | @IsString() @Matches(/^\d{6}$/) |
| CID | number | ไม่ | @IsInt() @Min(1) |
| WID | number | ไม่ | @IsInt() @IsIn([1,2,3,4,5]) |
| PRONG | string | ไม่ | @IsString() @MaxLength(2000) |
| EXPLAIN | string | ไม่ | @IsString() @MaxLength(4000) |
| REMARK | string | ไม่ | @IsString() @MaxLength(4000) |
| RELATED | string[] | ไม่ | @IsArray() @ArrayUnique() @ArrayMaxSize(100) @IsString({each:true}) |
| URGENT | boolean | ไม่ | @IsBoolean() |
| NEED_NEW_PART | string | ใช่ | @IsOptional() @IsIn(['Y','N']) |
| PARTS | PilineRejectPartDto[] | ไม่ | @IsArray() @ArrayMinSize(1) @ArrayMaxSize(100) @ValidateNested({each:true}) @Type(()=&gt;PilineRejectPartDto) |

### PilineRejectKeyDto

Source: `src/workload/piline_event_record/PILINE_REJECT_REQUEST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| NFRMNO | number | ไม่ | @IsInt() @IsIn([4]) |
| VORGNO | string | ไม่ | @IsString() @IsIn(['000101']) |
| CYEAR | string | ไม่ | @IsString() @IsIn(['18']) |
| CYEAR2 | string | ไม่ | @IsString() @Matches(/^20\d{2}$/) |
| NRUNNO | number | ไม่ | @IsInt() @Min(1) |

### SavePilineRejectDto

Source: `src/workload/piline_event_record/PILINE_REJECT_REQUEST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| KEY | PilineRejectKeyDto | ไม่ | @ValidateNested() @Type(()=&gt;PilineRejectKeyDto) |
| REQUEST | PilineRejectRequestDto | ไม่ | @ValidateNested() @Type(()=&gt;PilineRejectRequestDto) |

### CreatePilineInitialMstDto

Source: `src/workload/piline_initial_mst/dto/CREATE-PILINE_INITIAL_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| INITIAL_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| INITIAL_DETAIL | string | ไม่ | @IsString() @MaxLength(300) @Matches(/\S/, { message: '$property must not be blank' }) |
| STATUS | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(1) @Matches(/\S/, { message: '$property must not be blank' }) |

### KeyPilineInitialMstDto

Source: `src/workload/piline_initial_mst/dto/KEY-PILINE_INITIAL_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| INITIAL_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) @Transform(({ value }) =&gt; typeof value === 'string' &amp;&amp; /^-?\d+$/.test(value) ? Number(value) : value, ) |

### UpdatePilineInitialMstDto

Source: `src/workload/piline_initial_mst/dto/UPDATE-PILINE_INITIAL_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| INITIAL_DETAIL | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(300) @Matches(/\S/, { message: '$property must not be blank' }) |
| STATUS | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(1) @Matches(/\S/, { message: '$property must not be blank' }) |

### CreatePilineLocationMstDto

Source: `src/workload/piline_location_mst/dto/CREATE-PILINE_LOCATION_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| LOCATION_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| LOCATION_NAME | string | ไม่ | @IsString() @MaxLength(100) @Matches(/\S/, { message: '$property must not be blank' }) |
| STATUS | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(1) @Matches(/\S/, { message: '$property must not be blank' }) |

### KeyPilineLocationMstDto

Source: `src/workload/piline_location_mst/dto/KEY-PILINE_LOCATION_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| LOCATION_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) @Transform(({ value }) =&gt; typeof value === 'string' &amp;&amp; /^-?\d+$/.test(value) ? Number(value) : value, ) |

### UpdatePilineLocationMstDto

Source: `src/workload/piline_location_mst/dto/UPDATE-PILINE_LOCATION_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| LOCATION_NAME | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(100) @Matches(/\S/, { message: '$property must not be blank' }) |
| STATUS | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(1) @Matches(/\S/, { message: '$property must not be blank' }) |

### CreatePilineMappingMstDto

Source: `src/workload/piline_mapping_mst/dto/CREATE-PILINE_MAPPING_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| MAP_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| LOCATION_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| CAUSE_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| PROBLEM_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| EVENT_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| STATUS | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(1) @Matches(/\S/, { message: '$property must not be blank' }) |

### KeyPilineMappingMstDto

Source: `src/workload/piline_mapping_mst/dto/KEY-PILINE_MAPPING_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| MAP_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) @Transform(({ value }) =&gt; typeof value === 'string' &amp;&amp; /^-?\d+$/.test(value) ? Number(value) : value, ) |

### UpdatePilineMappingMstDto

Source: `src/workload/piline_mapping_mst/dto/UPDATE-PILINE_MAPPING_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| LOCATION_ID | number | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| CAUSE_ID | number | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| PROBLEM_ID | number | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| EVENT_ID | number | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| STATUS | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(1) @Matches(/\S/, { message: '$property must not be blank' }) |

### CreatePilineNgRecordDto

Source: `src/workload/piline_ng_record/dto/CREATE-PILINE_NG_RECORD.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| PILINE_NO | string | ไม่ | @IsString() @MaxLength(11) @Matches(/\S/, { message: '$property must not be blank' }) |
| ID_TAG | string | ไม่ | @IsString() @MaxLength(20) @Matches(/\S/, { message: '$property must not be blank' }) |
| QTY | number | ไม่ | @IsInt() @Min(-999) @Max(999) |
| MAT_LOT | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(20) |
| MAT_NO | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(20) |
| REMARK_NG | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(1000) |

### KeyPilineNgRecordDto

Source: `src/workload/piline_ng_record/dto/KEY-PILINE_NG_RECORD.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| PILINE_NO | string | ไม่ | @IsString() @MaxLength(11) @Matches(/\S/, { message: '$property must not be blank' }) |

### UpdatePilineNgRecordDto

Source: `src/workload/piline_ng_record/dto/UPDATE-PILINE_NG_RECORD.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| ID_TAG | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(20) @Matches(/\S/, { message: '$property must not be blank' }) |
| QTY | number | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsInt() @Min(-999) @Max(999) |
| MAT_LOT | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(20) |
| MAT_NO | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(20) |
| REMARK_NG | string &#124; null | ใช่ | @IsOptional() @IsString() @MaxLength(1000) |

### CreatePilineProblemMstDto

Source: `src/workload/piline_problem_mst/dto/CREATE-PILINE_PROBLEM_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| PROBLEM_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) |
| PROBLEM_NAME | string | ไม่ | @IsString() @MaxLength(200) @Matches(/\S/, { message: '$property must not be blank' }) |
| STATUS | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(1) @Matches(/\S/, { message: '$property must not be blank' }) |

### KeyPilineProblemMstDto

Source: `src/workload/piline_problem_mst/dto/KEY-PILINE_PROBLEM_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| PROBLEM_ID | number | ไม่ | @IsInt() @Min(Number.MIN_SAFE_INTEGER) @Max(Number.MAX_SAFE_INTEGER) @Transform(({ value }) =&gt; typeof value === 'string' &amp;&amp; /^-?\d+$/.test(value) ? Number(value) : value, ) |

### UpdatePilineProblemMstDto

Source: `src/workload/piline_problem_mst/dto/UPDATE-PILINE_PROBLEM_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| PROBLEM_NAME | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(200) @Matches(/\S/, { message: '$property must not be blank' }) |
| STATUS | string | ใช่ | @ValidateIf((_, value) =&gt; value !== undefined) @IsString() @MaxLength(1) @Matches(/\S/, { message: '$property must not be blank' }) |

### CreatePilineSectionMstDto

Source: `src/workload/piline_section_mst/dto/CREATE-PILINE_SECTION_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| SSECCODE | string | ไม่ | @IsString() @MaxLength(6) @Matches(/\S/, { message: '$property must not be blank' }) |

### KeyPilineSectionMstDto

Source: `src/workload/piline_section_mst/dto/KEY-PILINE_SECTION_MST.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| SSECCODE | string | ไม่ | @IsString() @MaxLength(6) @Matches(/\S/, { message: '$property must not be blank' }) |

### UpdatePilineSectionMstDto

Source: `src/workload/piline_section_mst/dto/UPDATE-PILINE_SECTION_MST.dto.ts`

ไม่มี field ประกาศเพิ่มเอง ดู base class ด้านบน (ถ้ามี)

### FiltersDto

Source: `src/common/dto/filter.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| filters | FilterNodeDto[] | ใช่ | @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() =&gt; FilterNodeDto) |
| AND | FilterNodeDto[] | ใช่ | @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() =&gt; FilterNodeDto) |
| OR | FilterNodeDto[] | ใช่ | @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() =&gt; FilterNodeDto) |

### FilterNodeDto

Source: `src/common/dto/filter.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| AND | FilterNodeDto[] | ใช่ | @IsOptional() @ValidateNested({ each: true }) @Type(() =&gt; FilterNodeDto) |
| OR | FilterNodeDto[] | ใช่ | @IsOptional() @ValidateNested({ each: true }) @Type(() =&gt; FilterNodeDto) |
| field | string | ใช่ | @IsOptional() @IsString() |
| op | string | ใช่ | @IsOptional() @IsIn([ 'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'startsWith', 'endsWith', 'in', 'notIn', 'between', 'isNull', 'isNotNull', ]) |
| value | any | ใช่ | @IsOptional() |
| type | any | ใช่ | @IsOptional() |

### piline_bending_att

Source: `src/common/Entities/workload/table/piline_bending_att.entity.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| IDTAG | string | ไม่ | @PrimaryColumn() |
| ID | number | ไม่ | @PrimaryColumn() |
| FILE_NAME | string | ไม่ | @Column({ nullable: true }) |

