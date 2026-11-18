# JIG — Endpoint และ DTO reference

อ้างอิง source วันที่ 22/10/2026; อ่านคู่มือหลักสำหรับ business rules และตัวอย่าง JSON

## Endpoint ทั้งหมด

Path ต่อท้าย {{BASE_URL}}; :name คือ path parameter; Body=JSON เว้น endpoint multipart ที่อธิบายในคู่มือหลัก

| Method | Path | Input / DTO | Handler |
|---|---|---|---|
| HEAD | `/iedoc/jig/inspection-reminders` | ไม่มี body/query | JigController.reminderHealth |
| POST | `/iedoc/jig/inspection-reminders` | Body(): InspectionReminderDto | JigController.sendInspectionReminders |
| GET | `/iedoc/jig/mfg-processes` | ไม่มี body/query | JigController.getMfgProcesses |
| POST | `/iedoc/jig/delete-forms` | Body(): CreateJigDeleteFormDto | JigController.createDeleteForm |
| GET | `/iedoc/jig/delete-forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO` | Param(): JigFormKeyDto | JigController.getDeleteForm |
| PATCH | `/iedoc/jig/delete-forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO` | Param(): JigFormKeyDto; Body(): SaveJigDeleteFormDto | JigController.saveDeleteForm |
| DELETE | `/iedoc/jig/delete-forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO/files/:FILE_SEQ` | Param(): JigFormFileKeyDto | JigController.deleteDeleteFormFile |
| POST | `/iedoc/jig/delete-forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO/finish` | Param(): JigFormKeyDto | JigController.finishDeleteForm |
| POST | `/iedoc/jig/delete-forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO/reject` | Param(): JigFormKeyDto | JigController.rejectDeleteForm |
| GET | `/iedoc/jig/locations` | ไม่มี body/query | JigController.getLocations |
| GET | `/iedoc/jig/ie-pics` | ไม่มี body/query | JigController.getIePics |
| GET | `/iedoc/jig/dashboard` | ไม่มี body/query | JigController.getDashboard |
| POST | `/iedoc/jig` | Body(): CreateJigRequestDto | JigController.createJig |
| POST | `/iedoc/jig/auto-inspection` | Body(): AutoInspectionDto | JigController.autoInspection |
| GET | `/iedoc/jig/forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO` | Param(): JigFormKeyDto | JigController.getForm |
| GET | `/iedoc/jig/forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO/ng-tag.pdf` | Param(): JigFormKeyDto | JigController.ngTagPdf |
| PATCH | `/iedoc/jig/forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO` | Param(): JigFormKeyDto; Body(): SaveJigFormDto | JigController.saveForm |
| POST | `/iedoc/jig/forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO/finish` | Param(): JigFormKeyDto; Body(): FinishInspectionDto | JigController.finishForm |
| POST | `/iedoc/jig/forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO/requester-flow` | Param(): JigFormKeyDto; Body(): ConfigureJigFlowDto | JigController.configureRequesterFlow |
| PUT | `/iedoc/jig/forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO/files` | Param(): JigFormKeyDto; Body(): JigFileDto | JigController.putFile |
| DELETE | `/iedoc/jig/forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO/files/:FILE_SEQ` | Param(): JigFormFileKeyDto | JigController.deleteFile |
| GET | `/iedoc/jig/:jigNo/checkpoints` | Param('jigNo'): string | JigController.getCheckpoints |
| GET | `/iedoc/jig/:jigNo/defect-ng` | Param('jigNo'): string | JigController.getDefectNg |
| PUT | `/iedoc/jig/:jigNo/checkpoints` | Param('jigNo'): string; Body(): ReplaceCheckpointsDto | JigController.replaceCheckpoints |
| GET | `/iedoc/jig/:jigNo/forms` | Param('jigNo'): string | JigController.listForms |
| POST | `/iedoc/jig/:jigNo/forms` | Param('jigNo'): string; Body(): CreateJigFormDto | JigController.createForm |
| GET | `/iedoc/jig/:jigNo` | Param('jigNo'): string | JigController.getJig |
| PATCH | `/iedoc/jig/:jigNo` | Param('jigNo'): string; Body(): UpdateJigDto | JigController.updateJig |

รวม 28 routes จาก controller ในขอบเขตนี้ ไม่ได้นับ service method ภายในที่ไม่มี HTTP route

## DTO และข้อกำหนด field

เครื่องหมาย optional อ้าง TypeScript/IsOptional/ValidateIf ให้ดู decorators ร่วมด้วย เพราะเงื่อนไข service อาจบังคับเพิ่ม เช่น START_USE_DATE ของ CREATE

PartialType ทำให้ช่องที่รับต่อมาเป็น optional; OmitType ตัดชื่อช่องตามรายการ; PickType เลือกเฉพาะช่อง; IntersectionType รวมช่องของทุก class อ้างตาราง class ต้นทางด้านล่างประกอบกัน

### AutoInspectionDto

Source: `src/iedoc/jig/dto/auto-inspection.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| date | string | ไม่ | @IsDefined() @IsString() @Matches(/^\d{2}\/\d{2}\/\d{4}$/) |

### CheckpointDto

Source: `src/iedoc/jig/dto/checkpoint.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| CHECK_SEQ | number | ไม่ | @IsDefined() @IsInt() @Min(1) @Max(999) |
| CHECK_POINT | string | ไม่ | @IsDefined() @IsNotEmpty() @IsString() @MaxLength(200) |
| INSPECTION_TOOL | string | ใช่ | @IsOptional() @IsString() @MaxLength(100) |
| MIN | number | ใช่ | @IsOptional() @IsNumber({ maxDecimalPlaces: 4 }) @Min(-99999999.9999) @Max(99999999.9999) |
| MAX | number | ใช่ | @IsOptional() @IsNumber({ maxDecimalPlaces: 4 }) @Min(-99999999.9999) @Max(99999999.9999) |
| MEASURED_VALUE | number &#124; null | ใช่ | @IsOptional() @IsNumber({ maxDecimalPlaces: 4 }) @Min(-99999999.9999) @Max(99999999.9999) |
| UNIT | string | ใช่ | @IsOptional() @IsString() @MaxLength(20) |

### ReplaceCheckpointsDto

Source: `src/iedoc/jig/dto/checkpoint.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| CHECKPOINTS | CheckpointDto[] | ไม่ | @IsDefined() @IsArray() @ArrayUnique((item) =&gt; item.CHECK_SEQ) @ValidateNested({ each: true }) @Type(() =&gt; CheckpointDto) |
| UPDATE_BY | string | ใช่ | @IsOptional() @IsString() @MaxLength(10) |

### CreateJigRequestDto

Source: `src/iedoc/jig/dto/create-jig-request.dto.ts`

รับ field เพิ่มตามนิยาม:

```typescript
extends IntersectionType(
    CreateJigFormDto,
    PartialType(PickType(CreateJigDto, ['JIG_NO'] as const)),
)
```

ไม่มี field ประกาศเพิ่มเอง ดู base class ด้านบน (ถ้ามี)

### CreateJigDto

Source: `src/iedoc/jig/dto/create-jig.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| JIG_NO | string | ไม่ | @IsDefined() @IsNotEmpty() @IsString() @MaxLength(20) |
| JIG_NAME | string | ไม่ | @IsDefined() @IsNotEmpty() @IsString() @MaxLength(200) |
| DWG | string | ใช่ | @IsOptional() @IsString() @MaxLength(100) |
| REV | string | ใช่ | @Transform(({ value }) =&gt; typeof value === 'number' ? String(value) : typeof value === 'string' ? value.trim() : value) @IsDefined() @IsNotEmpty() @IsString() @MaxLength(2) |
| JIG_QTY | number | ใช่ | @IsOptional() @IsInt() @Min(0) @Max(99999) |
| PRICE | number | ใช่ | @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(9999999999.99) |
| MAKER | string | ใช่ | @IsOptional() @IsString() @MaxLength(100) |
| START_USE_DATE | string | ใช่ | @IsOptional() @IsDateString({ strict: true }) |
| ITEMNO | string | ใช่ | @IsOptional() @IsString() @MaxLength(4) |
| JIG_DESC | string | ใช่ | @IsOptional() @IsString() @MaxLength(200) |
| PROCESS_CODE | string | ใช่ | @IsOptional() @IsString() @MaxLength(50) |
| LOCATION | string | ใช่ | @IsOptional() @IsString() @MaxLength(100) |
| PIC_EMPNO | string | ใช่ | @IsOptional() @IsString() @MaxLength(5) |
| INSPEC_PERIOD | number | ไม่ | @IsDefined() @IsInt() @Min(1) @Max(999) |
| REMARK | string | ใช่ | @IsOptional() @IsString() @MaxLength(1000) |

### FinishInspectionDto

Source: `src/iedoc/jig/dto/finish-inspection.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| UPDATE_BY | string | ใช่ | @IsOptional() @IsString() @MaxLength(10) |

### InspectionReminderDto

Source: `src/iedoc/jig/dto/inspection-reminder.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| date | string | ใช่ | @IsOptional() @IsString() @Matches(/^\d{2}\/\d{2}\/\d{4}$/) |
| dryRun | boolean | ใช่ | @IsOptional() @IsBoolean() |
| to | string[] | ใช่ | @IsOptional() @IsArray() @ArrayNotEmpty() @IsEmail({}, { each: true }) |
| cc | string[] | ใช่ | @IsOptional() @IsArray() @IsEmail({}, { each: true }) |

### JigDeleteContentDto

Source: `src/iedoc/jig/dto/jig-delete-form.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| REASON | string | ใช่ | @IsOptional() @IsString() @MaxLength(1000) |
| DETAIL | string | ใช่ | @IsOptional() @IsString() @MaxLength(1000) |
| FILES | JigFileDto[] | ใช่ | @IsOptional() @IsArray() @ArrayMaxSize(5) @ArrayUnique((file: JigFileDto) =&gt; file.FILE_SEQ) @ValidateNested({ each: true }) @Type(() =&gt; JigFileDto) |

### CreateJigDeleteFormDto

Source: `src/iedoc/jig/dto/jig-delete-form.dto.ts`

รับ field เพิ่มตามนิยาม:

```typescript
extends IntersectionType(JigFormKeyDto, JigDeleteContentDto)
```

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| JIG_NO | string | ไม่ | @IsString() @Matches(/\S/) @MaxLength(20) |

### SaveJigDeleteFormDto

Source: `src/iedoc/jig/dto/jig-delete-form.dto.ts`

รับ field เพิ่มตามนิยาม:

```typescript
extends JigDeleteContentDto
```

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| UPDATE_BY | string | ไม่ | @IsString() @Matches(/^[A-Za-z0-9]{1,10}$/) |

### JigFormKeyDto

Source: `src/iedoc/jig/dto/jig-form.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| NFRMNO | number | ไม่ | @Type(() =&gt; Number) @IsDefined() @IsInt() @Min(1) @Max(999) |
| VORGNO | string | ไม่ | @IsDefined() @IsNotEmpty() @IsString() @MaxLength(6) |
| CYEAR | string | ไม่ | @IsDefined() @IsString() @Matches(/^\d{2}$/) |
| CYEAR2 | string | ไม่ | @IsDefined() @IsString() @Matches(/^\d{4}$/) |
| NRUNNO | number | ไม่ | @Type(() =&gt; Number) @IsDefined() @IsInt() @Min(1) @Max(999999) |

### JigResultDto

Source: `src/iedoc/jig/dto/jig-form.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| CHECK_SEQ | number | ไม่ | @IsDefined() @IsInt() @Min(1) @Max(999) |
| MEASURED_VALUE | number | ใช่ | @IsOptional() @IsNumber({ maxDecimalPlaces: 4 }) @Min(-99999999.9999) @Max(99999999.9999) |
| RESULT | 'OK' &#124; 'NG' | ใช่ | @IsOptional() @IsIn(['OK', 'NG']) |

### JigNgDto

Source: `src/iedoc/jig/dto/jig-form.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| DEFECT_DETAIL | string | ไม่ | @IsDefined() @IsNotEmpty() @IsString() @MaxLength(500) |
| ACTION | string | ไม่ | @IsDefined() @IsNotEmpty() @IsString() @MaxLength(100) |
| CORRECTIVE | string | ไม่ | @IsDefined() @IsNotEmpty() @IsString() @MaxLength(100) |
| PLAN_DATE | string | ไม่ | @IsDefined() @IsDateString({ strict: true }) |

### JigFileDto

Source: `src/iedoc/jig/dto/jig-form.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| FILE_SEQ | number | ไม่ | @IsDefined() @IsInt() @Min(1) @Max(999999) |
| FILE_NAME | string | ไม่ | @IsDefined() @IsNotEmpty() @IsString() @MaxLength(255) |
| FILE_PATH | string | ไม่ | @IsDefined() @IsNotEmpty() @IsString() @MaxLength(1000) |
| FILE_TYPE | string | ใช่ | @IsOptional() @IsString() @MaxLength(100) |
| FILE_SIZE | number | ใช่ | @IsOptional() @IsInt() @Min(0) @Max(999999999999) |
| CREATE_BY | string | ใช่ | @IsOptional() @IsString() @MaxLength(10) |

### JigFormFileKeyDto

Source: `src/iedoc/jig/dto/jig-form.dto.ts`

รับ field เพิ่มตามนิยาม:

```typescript
extends JigFormKeyDto
```

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| FILE_SEQ | number | ไม่ | @Type(() =&gt; Number) @IsInt() @Min(1) @Max(999999) |

### ConfigureJigFlowDto

Source: `src/iedoc/jig/dto/jig-form.dto.ts`

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| PICCODE | string | ใช่ | @IsOptional() @IsString() @IsNotEmpty() @MaxLength(10) |

### CreateJigDetailDto

Source: `src/iedoc/jig/dto/jig-form.dto.ts`

รับ field เพิ่มตามนิยาม:

```typescript
extends IntersectionType(
    CheckpointDto,
    OmitType(JigResultDto, ['CHECK_SEQ'] as const),
)
```

ไม่มี field ประกาศเพิ่มเอง ดู base class ด้านบน (ถ้ามี)

### SaveJigDetailDto

Source: `src/iedoc/jig/dto/jig-form.dto.ts`

รับ field เพิ่มตามนิยาม:

```typescript
extends IntersectionType(
    JigResultDto,
    PartialType(OmitType(CheckpointDto, ['CHECK_SEQ'] as const), {
        skipNullProperties: false,
    }),
)
```

ไม่มี field ประกาศเพิ่มเอง ดู base class ด้านบน (ถ้ามี)

### CreateJigFormDto

Source: `src/iedoc/jig/dto/jig-form.dto.ts`

รับ field เพิ่มตามนิยาม:

```typescript
extends IntersectionType(
    JigFormKeyDto,
    PatchJigSnapshotDto,
)
```

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| PICCODE | string | ใช่ | @IsOptional() @IsString() @IsNotEmpty() @MaxLength(10) |
| FORM_TYPE | 'CREATE' &#124; 'INSPECTION' | ไม่ | @IsDefined() @IsIn(['CREATE', 'INSPECTION']) |
| CREATE_BY | string | ใช่ | @IsOptional() @IsString() @MaxLength(10) |
| DETAILS | CreateJigDetailDto[] | ใช่ | @IsOptional() @IsArray() @ArrayUnique((item) =&gt; item.CHECK_SEQ) @ValidateNested({ each: true }) @Type(() =&gt; CreateJigDetailDto) |
| FILES | JigFileDto[] | ใช่ | @IsOptional() @IsArray() @ArrayUnique((item) =&gt; item.FILE_SEQ) @ValidateNested({ each: true }) @Type(() =&gt; JigFileDto) |
| NG | JigNgDto &#124; null | ใช่ | @IsOptional() @ValidateNested() @Type(() =&gt; JigNgDto) |
| CHECKPOINTS | CheckpointDto[] | ใช่ | @IsOptional() @IsArray() @ArrayUnique((item) =&gt; item.CHECK_SEQ) @ValidateNested({ each: true }) @Type(() =&gt; CheckpointDto) |

### SaveJigFormDto

Source: `src/iedoc/jig/dto/jig-form.dto.ts`

รับ field เพิ่มตามนิยาม:

```typescript
extends PatchJigSnapshotDto
```

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| REPLACE_DETAILS | boolean | ใช่ | @IsOptional() @IsBoolean() |
| REPLACE_FILES | boolean | ใช่ | @IsOptional() @IsBoolean() |
| UPDATE_BY | string | ใช่ | @IsOptional() @IsString() @MaxLength(10) |
| DETAILS | SaveJigDetailDto[] | ใช่ | @IsOptional() @IsArray() @ArrayUnique((item) =&gt; item.CHECK_SEQ) @ValidateNested({ each: true }) @Type(() =&gt; SaveJigDetailDto) |
| FILES | JigFileDto[] | ใช่ | @IsOptional() @IsArray() @ArrayUnique((item) =&gt; item.FILE_SEQ) @ValidateNested({ each: true }) @Type(() =&gt; JigFileDto) |
| NG | JigNgDto &#124; null | ใช่ | @IsOptional() @ValidateNested() @Type(() =&gt; JigNgDto) |

### JigSnapshotDto

Source: `src/iedoc/jig/dto/jig-snapshot.dto.ts`

รับ field เพิ่มตามนิยาม:

```typescript
extends OmitType(CreateJigDto, [
    'JIG_NO',
] as const)
```

ไม่มี field ประกาศเพิ่มเอง ดู base class ด้านบน (ถ้ามี)

### PatchJigSnapshotDto

Source: `src/iedoc/jig/dto/jig-snapshot.dto.ts`

รับ field เพิ่มตามนิยาม:

```typescript
extends PartialType(JigSnapshotDto, {
    skipNullProperties: false,
})
```

ไม่มี field ประกาศเพิ่มเอง ดู base class ด้านบน (ถ้ามี)

### UpdateJigDto

Source: `src/iedoc/jig/dto/update-jig.dto.ts`

รับ field เพิ่มตามนิยาม:

```typescript
extends SaveJigFormDto
```

| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |
|---|---|---|---|
| FORM_KEY | JigFormKeyDto | ไม่ | @IsDefined() @ValidateNested() @Type(() =&gt; JigFormKeyDto) |

