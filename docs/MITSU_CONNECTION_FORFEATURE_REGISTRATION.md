# บันทึกการแก้ไข: การลงทะเบียน Entity ด้วย `TypeOrmModule.forFeature()` บน `mitsuConnection`

> **วันที่บันทึก:** 4 พฤศจิกายน 2026  
> **สถานะ:** เสร็จสมบูรณ์ (Compile ผ่าน 100% ด้วย `npx tsc --noEmit`)  
> **จำนวนโมดูลที่แก้ไข:** 43 โมดูล

---

## 📌 ที่มาและสาเหตุของปัญหา (Problem & Root Cause)

### ปัญหาที่พบ
เมื่อมีการเรียกใช้งาน API เช่น `/checkinventory/getHalfyearReport` เกิด Error 500:
```json
{
  "statusCode": 500,
  "message": "No metadata for \"INV_HALFYEAR_REPORT\" was found."
}
```

### สาเหตุเชิงเทคนิค (Root Cause)
1. **พฤติกรรมของ `autoLoadEntities: true` ใน NestJS TypeORM:**  
   แม้จะเปิด `autoLoadEntities: true` ในการตั้งค่าการเชื่อมต่อฐานข้อมูล (`mitsuConnection`) แต่ NestJS จะไม่กวาดไฟล์ Entity บนดิสก์เอง หากไม่มีโมดูลใดประกาศ Entity นั้นผ่าน `TypeOrmModule.forFeature([Entity], 'mitsuConnection')`
2. **การขาดการลงทะเบียน Entity ในโมดูล:**  
   โมดูลที่เชื่อมต่อ `mitsuConnection` จำนวนมาก อาศัยการ inject `DataSource` หรือสืบทอดจาก `BaseRepository` แล้วเรียกใช้ `this.getRepository(Entity)` โดยตรง โดยไม่ได้ใส่ `TypeOrmModule.forFeature()` ไว้ใน `imports` ของโมดูล
3. **ผลกระทบ:**  
   หาก Entity ตัวใดไม่เคยถูกโมดูลอื่นในระบบโหลด `forFeature` ไว้ เมื่อถูกเรียกใช้งาน จะเกิดข้อผิดพลาด `EntityMetadataNotFoundError` (Error 500) ทันที

---

## 🛠️ รายละเอียดการปรับปรุง (Summary of Changes)

ได้ทำการอัปเดตไฟล์ `.module.ts` ของทั้ง 43 โมดูล โดย:
1. Import `TypeOrmModule` จาก `@nestjs/typeorm`
2. Import Entity ที่จำเป็นทั้งหมดของโมดูลนั้นๆ (รวมถึง Related Entities ที่ใช้ใน Relations)
3. เพิ่ม `TypeOrmModule.forFeature([...], 'mitsuConnection')` เข้าไปใน `imports` ของแต่ละโมดูล

---

## 🗂️ รายการโมดูลที่ได้รับการปรับปรุงทั้งหมด (43 โมดูล)

### 1. หมวด Warehouse (2 โมดูล)
| โมดูล | ไฟล์ที่แก้ไข | Entities ที่ลงทะเบียนใน `forFeature` |
|---|---|---|
| `CheckinventoryModule` | `src/warehouse/checkinventory/checkinventory.module.ts` | `INV_HALFYEAR_REPORT`, `INV_HALFYEAR_REPORT_ASSIGN`, `PSCI_FORM`, `PSCIH_FORM`, `INV_HALFYEAR_RESULT`, `INV_YEARLY_RESULT`, `INV_YEARLY_ASSIGN`, `PSYIC_FORM` |
| `VendingModule` | `src/warehouse/vending/vending.module.ts` | `VENDING_USER`, `Products`, `StockBalances`, `TOOL_IMPORT_HISTORY`, `TOOL_WITHDRAWAL`, `TOOL_REFILL`, `AMECUSERALL`, `Categories`, `ORGPOS`, `QAINS_FORM`, `QAINS_OPERATOR_AUDITOR`, `USERS`, `INV_YEARLY_ASSIGN` |

### 2. หมวด GP Report & DTI (2 โมดูล)
| โมดูล | ไฟล์ที่แก้ไข | Entities ที่ลงทะเบียนใน `forFeature` |
|---|---|---|
| `BeneficiaryModule` | `src/gpreport/beneficiary/beneficiary.module.ts` | `BENEFICIARY` |
| `CmSmModule` | `src/dti/cm-sm/cm-sm.module.ts` | `DTIH`, `CM_SM_FORM`, `LOG_INFO_TIMEL` |

### 3. หมวด Innovat (Wire Harness) (5 โมดูล)
| โมดูล | ไฟล์ที่แก้ไข | Entities ที่ลงทะเบียนใน `forFeature` |
|---|---|---|
| `WireHarnessCalculateUsageModule` | `src/innovat/wire-harness-calculate-usage/wire-harness-calculate-usage.module.ts` | `WHN_AUTOPLAN` |
| `WireHarnessCuttingModule` | `src/innovat/wire-harness-cutting/wire-harness-cutting.module.ts` | `WHN_PRODUCTION_PLAN`, `WHN_PROCESS`, `WHN_DRUM_STOCK`, `WHN_PRODUCTION`, `WHN_AUTOPLAN`, `WHN_REASON` |
| `WireHarnessDrumMasterModule` | `src/innovat/wire-harness-drum-master/wire-harness-drum-master.module.ts` | `WHN_DRUM_MASTER` |
| `WireHarnessDrumStockModule` | `src/innovat/wire-harness-drum-stock/wire-harness-drum-stock.module.ts` | `WHN_DRUM_STOCK`, `WHN_DRUMSTOCK`, `WHN_DRUMORDER` |
| `WireHarnessJobModule` | `src/innovat/wire-harness-job/wire-harness-job.module.ts` | `WHN_PRODUCTION_PLAN` |

### 4. หมวด Webform (25 โมดูล)
| โมดูล | ไฟล์ที่แก้ไข | Entities ที่ลงทะเบียนใน `forFeature` |
|---|---|---|
| `FormLinkModule` | `src/webform/form-link/form-link.module.ts` | `FORM_LINK` |
| `FeFileModule` | `src/webform/feform/fe-file/fe-file.module.ts` | `FE_FILE` |
| `FinFileModule` | `src/webform/finform/fin-file/fin-file.module.ts` | `FIN_FILE` |
| `FinpckVwdetailModule` | `src/webform/finform/fin-pck/finpck-vwdetail/finpck-vwdetail.module.ts` | `FINPCK_VWDETAIL` |
| `FinpckVwstatusModule` | `src/webform/finform/fin-pck/finpck-vwstatus/finpck-vwstatus.module.ts` | `FINPCK_VWSTATUS` |
| `FinpckAssetModule` | `src/webform/finform/fin-pck/finpck_asset/finpck_asset.module.ts` | `FINPCK_ASSET`, `FINPCK_FORM`, `FXA_GRPMST` |
| `FinpckFormModule` | `src/webform/finform/fin-pck/finpck_form/finpck_form.module.ts` | `FINPCK_FORM`, `FINPCK_ASSET` |
| `FxaGrpmstModule` | `src/webform/finform/fxa_grpmst/fxa_grpmst.module.ts` | `FXA_GRPMST` |
| `GpFileModule` | `src/webform/gpform/gp-file/gp-file.module.ts` | `GP_FILE` |
| `IeFileModule` | `src/webform/ieform/ie-file/ie-file.module.ts` | `IE_FILE` |
| `IetsFormModule` | `src/webform/ieform/ie-ts/iets_form/iets_form.module.ts` | `IETS_FORM`, `DWGNOTICEPICMST`, `AMECUSERALL`, `VORGMST`, `IETS_LIST`, `FORM`, `User`, `ORGPOS`, `QAINS_FORM`, `QAINS_OPERATOR_AUDITOR`, `USERS`, `INV_YEARLY_ASSIGN` |
| `IetsListModule` | `src/webform/ieform/ie-ts/iets_list/iets_list.module.ts` | `IETS_LIST`, `IETS_FORM`, `DWGNOTICEPICMST` |
| `IsSefModule` | `src/webform/isform/is-sef/is-sef.module.ts` | `ISEVA_SESSIONS`, `ISEVA_SCORES`, `ISEVA_CRITERIA`, `WorkPlan` |
| `MarFileModule` | `src/webform/marform/mar-file/mar-file.module.ts` | `MAR_FILE` |
| `MfgFileModule` | `src/webform/mfgform/mfg-file/mfg-file.module.ts` | `MFG_FILE` |
| `MfgVtrModule` | `src/webform/mfgform/mfg-vtr/mfg-vtr.module.ts` | `MFGVTR_DETAIL`, `MFGVTR_FORM`, `Products`, `Categories` |
| `PsCiModule` | `src/webform/psform/ps-ci/ps-ci.module.ts` | `INV_CHECK_LOG`, `INV_CHECK_RESULT`, `INV_HALFYEAR_RESULT` |
| `PsCihModule` | `src/webform/psform/ps-cih/ps-cih.module.ts` | `INV_HALFYEAR_RESULT`, `PSCIH_FORM`, `INV_CHECK_LOG`, `MV_IMM_ITEMMST`, `INV_HALFYEAR_REPORT` |
| `PsFileModule` | `src/webform/psform/ps-file/ps-file.module.ts` | `PS_FILE` |
| `PsUpiModule` | `src/webform/psform/ps-upi/ps-upi.module.ts` | `PSUPI_REQUISITION`, `PSUPI_REASON`, `FORM`, `FORMMST`, `User`, `FLOW`, `QAINS_FORM`, `FORMMST_GROUP` |
| `PsVarModule` | `src/webform/psform/ps-var/ps-var.module.ts` | `INV_CHECK_ASSIGN`, `INV_HALFYEAR_RESULT`, `PSVAR_FORM`, `PSCIH_FORM`, `MV_IMM_ITEMMST`, `INV_CHECK_LOG` |
| `PsYicModule` | `src/webform/psform/ps-yic/ps-yic.module.ts` | `INV_YEARLY_RESULT`, `PSYIC_FORM`, `INV_YEARLY_ASSIGN`, `MV_IMM_ITEMMST` |
| `PurCpcModule` | `src/webform/purform/pur-cpc/pur-cpc.module.ts` | `COND_COMPARISON_PRICE`, `PURCPC_DETAILS`, `PURCPC_FORM`, `PURCPC_FORM_LISTS_VIEW`, `PURCPC_PROC_COMPARE_VIEW`, `PURCPC_PROC_ITEMDETAIL`, `PURCPC_PROC_LIST_VIEW` |
| `PurvmmScmusrModule` | `src/webform/purform/pur-vmm/purvmm_scmusr/purvmm_scmusr.module.ts` | `PURVMM_SCMUSR`, `PURVMM_FORM` |
| `StInpModule` | `src/webform/stform/st-inp/st-inp.module.ts` | `FORM`, `FLOW`, `AMECUSERALL`, `User`, `FORMMST`, `QAINS_FORM`, `ORGPOS`, `QAINS_OPERATOR_AUDITOR`, `USERS`, `INV_YEARLY_ASSIGN` |

### 5. หมวด Workload (9 โมดูล)
| โมดูล | ไฟล์ที่แก้ไข | Entities ที่ลงทะเบียนใน `forFeature` |
|---|---|---|
| `CountryOriginCountryModule` | `src/workload/country_origin_country/country_origin_country.module.ts` | `COUNTRY_ORIGIN_COUNTRY` |
| `CountryOriginNotSetViewModule` | `src/workload/country_origin_not_set_view/country_origin_not_set_view.module.ts` | `COUNTRY_ORIGIN_NOT_SET_VIEW` |
| `DpmsCountryConditionModule` | `src/workload/dpms_country_condition/dpms_country_condition.module.ts` | `DPMS_COUNTRY_CONDITION` |
| `DpmsPackingListDetailModule` | `src/workload/dpms_packing_list_detail/dpms_packing_list_detail.module.ts` | `DPMS_PACKING_LIST_DETAIL`, `DPMS_PACKING_LIST_MAIN` |
| `LabelconfirmModule` | `src/workload/labelconfirm/labelconfirm.module.ts` | `KITTING_EVENT_LOG`, `KITTING_LABEL` |
| `ShortageModule` | `src/workload/shortage/shortage.module.ts` | `SHORTAGE_ISSUE`, `VW_SHORTAGE_REPORT`, `SHORT_PUR_TRACKING` |
| `StockPartFollowModule` | `src/workload/stock_part_follow/stock_part_follow.module.ts` | `STOCK_PART_FOLLOW` |
| `StockPartFollowViewModule` | `src/workload/stock_part_follow_view/stock_part_follow_view.module.ts` | `STOCK_PART_FOLLOW_VIEW` |
| `VpsModule` | `src/workload/vps/vps.module.ts` | `PKC_CARTON_DETAIL` |

---

## 🔍 การทดสอบและผลลัพธ์ (Verification)

* ดำเนินการรันการตรวจสอบ TypeScript ทั่วทั้งระบบ:
  ```bash
  npx tsc --noEmit
  ```
  **ผลลัพธ์:** สำเร็จเรียบร้อย ไม่พบ Error (Exit code: 0)

