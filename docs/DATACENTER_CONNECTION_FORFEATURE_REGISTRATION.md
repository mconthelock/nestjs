# บันทึกการแก้ไข: การลงทะเบียน Entity ด้วย `TypeOrmModule.forFeature()` บน `datacenterConnection`

> **วันที่บันทึก:** 4 พฤศจิกายน 2026  
> **สถานะ:** เสร็จสมบูรณ์ (Compile ผ่าน 100% ด้วย `npx tsc --noEmit`)  
> **ฐานข้อมูล:** Oracle (`datacenterConnection`)

---

## 📌 ที่มาและปัญหาที่พบ (Problem & Background)

ต่อเนื่องจากการตรวจสอบและแก้ไข `mitsuConnection` ได้ทำการตรวจสอบโมดูลทั้งหมดในระบบที่มีการเชื่อมต่อกับ **`datacenterConnection`** เพื่อป้องกันปัญหา `EntityMetadataNotFoundError: No metadata for "..." was found.` แบบเดียวกัน

จากการตรวจสอบพบว่าโมดูลส่วนใหญ่ในระบบ (23 โมดูล) มีการลงทะเบียน `TypeOrmModule.forFeature([Entity], 'datacenterConnection')` ไว้อย่างถูกต้องแล้ว แต่ยังคงมีจุดที่มีการเรียกใช้ Entity บน `datacenterConnection` โดยขาดการประกาศ `forFeature` ดังนี้:

1. **`IimModule` (`src/datacenter/iim/`):**  
   Repository เรียก `this.getRepository(IIM)` บน `datacenterConnection` แต่ใน `iim.module.ts` ไม่ได้ใส่ `TypeOrmModule.forFeature()` เลย และไม่มีที่อื่นในระบบโหลด Entity `IIM` ไว้
2. **`MasterkeyModule`, `PromoteModule`, `TwidocModule` (`src/hradmin/`):**  
   มีการเรียกใช้ `DatabaseService.getMasterKey()` ซึ่งใช้ `this.ds.getRepository(Masterkey)` บน `datacenterConnection` แต่ Entity `Masterkey` ไม่เคยถูกประกาศลงใน `TypeOrmModule.forFeature()` ที่ใดเลย
3. **`PilineSectionMstModule` (`src/workload/piline_section_mst/`):**  
   ใน `PILINE_SECTION_MST.repository.ts` มีการ inject `datacenterConnection` (`amecDs`) และเรียก `this.amecDs.getRepository(Psection)` แต่ `Psection` ถูกลงทะเบียนไว้เฉพาะใน `mitsuConnection`
4. **`PilineEventRecordModule` (`src/workload/piline_event_record/`):**  
   ใน `PILINE_EVENT_RECORD.repository.ts` และ `PILINE_IDTAG.controller.ts` มีการ inject `datacenterConnection` ไปเรียก `getRepository(F110KP)` โดยที่โมดูลของตัวเองไม่ได้ประกาศ `forFeature([F110KP], 'datacenterConnection')` ไว้อย่างชัดเจน

---

## 🛠️ รายละเอียดการปรับปรุง (Summary of Changes)

ได้ทำการปรับปรุงไฟล์โมดูลทั้งหมด 6 ไฟล์ เพื่อลงทะเบียน Entity บน `datacenterConnection` ให้ครบถ้วน:

| ลำดับ | โมดูล | ไฟล์ที่แก้ไข | Entities ที่ลงทะเบียนใน `forFeature` (datacenterConnection) |
|:---:|---|---|---|
| 1 | `IimModule` | [`src/datacenter/iim/iim.module.ts`](file:///d:/project/php85/src/api/src/datacenter/iim/iim.module.ts) | `IIM` |
| 2 | `MasterkeyModule` | [`src/hradmin/masterkey/masterkey.module.ts`](file:///d:/project/php85/src/api/src/hradmin/masterkey/masterkey.module.ts) | `Masterkey` |
| 3 | `PromoteModule` | [`src/hradmin/promote/promote.module.ts`](file:///d:/project/php85/src/api/src/hradmin/promote/promote.module.ts) | `Masterkey` |
| 4 | `TwidocModule` | [`src/hradmin/twidoc/twidoc.module.ts`](file:///d:/project/php85/src/api/src/hradmin/twidoc/twidoc.module.ts) | `Masterkey` |
| 5 | `PilineSectionMstModule` | [`src/workload/piline_section_mst/piline_section_mst.module.ts`](file:///d:/project/php85/src/api/src/workload/piline_section_mst/piline_section_mst.module.ts) | `Psection` *(ควบคู่กับ `PILINE_SECTION_MST` บน `mitsuConnection`)* |
| 6 | `PilineEventRecordModule` | [`src/workload/piline_event_record/piline_event_record.module.ts`](file:///d:/project/php85/src/api/src/workload/piline_event_record/piline_event_record.module.ts) | `F110KP` *(ควบคู่กับ `PILINE_EVENT_RECORD` บน `mitsuConnection`)* |

---

## 🔍 การทดสอบและผลลัพธ์ (Verification)

* ดำเนินการรันการตรวจสอบ TypeScript compilation ทั้งโปรเจกต์:
  ```bash
  npx tsc --noEmit
  ```
  **ผลลัพธ์:** สำเร็จเรียบร้อย ไม่พบ Error (Exit code: 0)

