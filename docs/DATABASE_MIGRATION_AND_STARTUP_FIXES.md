# สรุปรายงานการปรับปรุงระบบ: การย้ายฐานข้อมูลสู่ `mitsuConnection` และแก้ไข Startup Issues
## (ครอบคลุม Commit ทั้งหมดตั้งแต่ `af79e18d` จนถึงปัจจุบัน)

> **ช่วง Commit ที่ครอบคลุม:** `af79e18d2e54e4f73d2aa267e0b05cfed46acc64` .. `HEAD`  
> **ผู้ดำเนินการ (Author):** Chalormsak Sawanam (`BB8` <chalorms@MitsubishiElevatorAsia.co.th>)  
> **วันที่บันทึก:** 3 พฤศจิกายน 2026  
> **วัตถุประสงค์:** สรุปรายการเปลี่ยนแปลง โครงสร้างไฟล์ที่แก้ไข และเหตุผลของแต่ละ Commit เพื่อรายงานให้ทีมงานรับทราบอย่างเป็นทางการ

---

## 📌 สารบัญภาพรวม (Executive Summary)

ตั้งแต่ Commit `af79e18d` เป็นต้นมา ได้มีการดำเนินงานหลัก 5 ด้าน:
1. **การรวม Database Connections:** ยุบ Connection ย่อยของ Oracle หลายตัวเข้าสู่ศูนย์กลางคือ **`mitsuConnection`** พร้อมเปิดใช้งาน `autoLoadEntities: true`
2. **การ Refactor โมดูลและ Repository:** ทยอยเปลี่ยนการ Inject DataSource และ Repository จาก Connection เดิม (`ebudgetConnection`, `gpreportConnection`, `innovatConnection`, ฯลฯ) มาเป็น `mitsuConnection`
3. **การแก้ปัญหา `Entity metadata was not found`:** ตรวจสอบและลงทะเบียน Entity ขาดหายทั่วทั้งโปรเจกต์ 24 จุด พร้อมตัดความสัมพันธ์ (Decouple) ที่ไม่ได้ใช้งานจริง
4. **การเขียน Unit Test ควบคุมคุณภาพ:** เพิ่ม Test Suite 24 ข้อสำหรับ `ebudget` เพื่อการันตีว่าทำงานบน `mitsuConnection` ได้ถูกต้อง
5. **การสร้าง Benchmark Tools & Profiling:** ตรวจสอบจับเวลาจริงของ Database ทั้ง 8 ตัว และวิเคราะห์คอขวดของ NestJS Startup

---

## 🗂️ รายละเอียดการแก้ไขแบ่งตาม Commit (Commit History & Changes)

```
4afdd640 (HEAD) feat: update database connections and add benchmark tools
aad1ab1f Refactor job order and set request date modules for improved database connections and entity structure
8421a557 refactor: update database connection from 'gpreportConnection' to 'mitsuConnection' across multiple services and modules
c896e92a feat: add initial entities and services for Q141KP and M008KP modules
002b62e2 fix: make JigFlowService optional in JigRepository and export it from JigModule
70f069a2 refactor: update database connections to use mitsuConnection and clean up commented imports
b315d0e7 refactor: update Jig module to use mitsuConnection and improve code formatting
5d2fe595 feat: add unit tests for SnModule with mitsuConnection integration
af79e18d Refactor database configurations to use mitsuConnection and enable autoLoadEntities for AMEC environment
```

---

### 1. Commit `af79e18d` : เริ่มต้นรวมฐานข้อมูลสู่ `mitsuConnection` & เปิด `autoLoadEntities`
* **Commit Message:** `Refactor database configurations to use mitsuConnection and enable autoLoadEntities for AMEC environment`
* **เหตุผลการแก้ไข:** 
  * รวม Database Config ของ Oracle เข้าเป็นจุดเดียวเพื่อลดภาระ Connection Pool และจัดการ Lifecycle ของ Connection กลางได้ง่ายขึ้น
  * เปิด `autoLoadEntities: true` ในทุก Database Config เพื่อให้ NestJS โหลด Entity ตาม Module อัตโนมัติ
* **ไฟล์หลักที่แก้ไข:**
  * `src/common/databases/mitsu.config.ts` *(สร้างใหม่)*: กำหนดการเชื่อมต่อ Oracle `mitsuConnection` และจัดการ Pool Options
  * `src/common/common.module.ts`: สลับมาใช้ `mitsuConfig` และปิด Connection เก่า
  * `src/common/databases/`: อัปเดตไฟล์ config ต่างๆ (`dailyids`, `ebudget`, `elmes`, `escs`, `gpreport`, `innovat`, `invoice`, `pdm`, `packingsys`, `sdsys`, `spsys`, `webform`, `workload`) ให้รองรับ `autoLoadEntities`
  * `src/ebudget/`: ย้าย Repository ทั้งหมด 8 ตัว (`bidding`, `ebgreqattfile`, `ebgreqcase`, `ebgreqcol-image`, `ebgreqform`, `ebudget-quotation`, `ebudget-quotation-product`, `sn`) จาก `@InjectDataSource('ebudgetConnection')` มาเป็น `@InjectDataSource('mitsuConnection')`

---

### 2. Commit `5d2fe595` : เพิ่ม Unit Tests ยืนยันการย้ายฐานข้อมูล ebudget
* **Commit Message:** `feat: add unit tests for SnModule with mitsuConnection integration`
* **เหตุผลการแก้ไข:**
  * ป้องกันข้อผิดพลาดจากการเปลี่ยนชื่อ Connection และยืนยันว่า Repository ทั้งหมดของ Ebudget ทำงานบน `mitsuConnection` ได้จริง
* **ไฟล์ที่เพิ่มเข้าไป:**
  * `src/ebudget/sn/sn.spec.ts`: Unit test สำหรับ SnModule (4 tests)
  * `src/ebudget/ebudget-connection.spec.ts`: Unit test ตรวจสอบ DI Injection และ Query Execution ของ 8 Repositories ครบถ้วน (24 tests ผ่าน 100%)

---

### 3. Commit `b315d0e7` : ปรับปรุง IEDOC (Jig Module) และล้างโค้ดที่ไม่ใช้งาน
* **Commit Message:** `refactor: update Jig module to use mitsuConnection and improve code formatting`
* **เหตุผลการแก้ไข:**
  * ย้าย `JigModule` ใน IEDOC ให้มาเชื่อมต่อกับ `mitsuConnection`
  * ลบโมดูลและ Entity เก่าที่เลิกใช้งานแล้วใน `invoice` (`Fowarder` และ `Mode`) เพื่อลดขนาด Codebase
* **ไฟล์หลักที่แก้ไข:**
  * `src/iedoc/jig/jig.repository.ts`, `jig.module.ts`, `jig-reminder.service.ts`: เชื่อมต่อผ่าน `mitsuConnection`
  * `src/common/Entities/iedoc/table/`: ปรับปรุง Entity ของ Jig ทั้งหมด
  * ลบโฟลเดอร์: `src/invoice/fowarder/` และ `src/invoice/mode/`

---

### 4. Commit `70f069a2` : ย้าย Innovat Wire Harness สู่ `mitsuConnection`
* **Commit Message:** `refactor: update database connections to use mitsuConnection and clean up commented imports`
* **เหตุผลการแก้ไข:**
  * ย้ายกลุ่ม Wire Harness Repositories ในโมดูล Innovat จากเดิมที่เคยผูกกับ `innovatConnection` เข้ามาใช้ `mitsuConnection`
  * Export รายงานโครงสร้าง Entity ที่ยังเหลืออยู่ในแต่ละโฟลเดอร์ออกมาเป็น `remaining_entities_report.xlsx` เพื่อใช้วิเคราะห์
* **ไฟล์หลักที่แก้ไข:**
  * `src/innovat/wire-harness-calculate-usage/wire-harness-calculate-usage.repository.ts`
  * `src/innovat/wire-harness-cutting/wire-harness-cutting.repository.ts`
  * `src/innovat/wire-harness-drum-master/wire-harness-drum-master.repository.ts`
  * `src/innovat/wire-harness-drum-stock/wire-harness-drum-stock.repository.ts`
  * `src/innovat/wire-harness-job/wire-harness-job.repository.ts`

---

### 5. Commit `002b62e2` : แก้ไข Dependency Injection ของ Jig Module
* **Commit Message:** `fix: make JigFlowService optional in JigRepository and export it from JigModule`
* **เหตุผลการแก้ไข:**
  * แก้ไข Circular Dependency และปัญหาหา `JigFlowService` ไม่เจอใน DI Container ของ NestJS ระหว่างที่ JigRepository ถูกเรียกใช้
* **ไฟล์ที่แก้ไข:**
  * `src/iedoc/jig/jig.module.ts`: Export `JigFlowService` ออกไปให้โมดูลอื่นใช้งานได้
  * `src/iedoc/jig/jig.repository.ts`: กำหนดให้ `JigFlowService` เป็น Optional (`@Optional()`)

---

### 6. Commit `c896e92a` : เพิ่ม Entities และ Services สำหรับโมดูล AS400
* **Commit Message:** `feat: add initial entities and services for Q141KP and M008KP modules`
* **เหตุผลการแก้ไข:**
  * รองรับการเชื่อมต่อกับระบบ AS400 RTNLIBF (โมดูล Q141KP และ M008KP)
* **ไฟล์ที่เพิ่ม/แก้ไข:**
  * `src/as400/rtnlibf/q141kp/` (controller, module, service, entity)
  * `src/as400/rtnlibf/m008kp/` (controller, module, service, entity)

---

### 7. Commit `8421a557` : ย้ายระบบ `gpreport` ทั้งหมดสู่ `mitsuConnection`
* **Commit Message:** `refactor: update database connection from 'gpreportConnection' to 'mitsuConnection' across multiple services and modules`
* **เหตุผลการแก้ไข:**
  * ทำการย้ายโมดูลกลุ่มบุคคลากรและสวัสดิการ (GP Report) ทั้งหมดจากเดิมที่ใช้ `gpreportConnection` เข้ามาสู่ Connection กลาง `mitsuConnection`
* **ไฟล์ที่แก้ไข (16 โมดูลใน `src/gpreport/`):**
  * `bonus`, `fund`, `loan`, `medemp`, `medfm`, `orgpos`, `salrate`, `socfee`, `trainemp`, `v_emp_cost_center`, `gpreport.module.ts`, ฯลฯ
  * เปลี่ยนทั้ง `TypeOrmModule.forFeature(..., 'mitsuConnection')` และ `@InjectRepository(..., 'mitsuConnection')`

---

### 8. Commit `aad1ab1f` : ปรับปรุง Job Order และ Set Request Date
* **Commit Message:** `Refactor job order and set request date modules for improved database connections and entity structure`
* **เหตุผลการแก้ไข:**
  * ย้าย `OrderListModule` ไปใช้ `datacenterConnection` ให้สอดคล้องกับโครงสร้างจริง
  * ย้าย `SetRequestDateModule` มาใช้ `mitsuConnection` และปรับปรุง Transaction
  * ทำความสะอาด Import Path ของ `user.entity.ts` ทั่วทั้งโปรเจกต์ให้ชี้ไปที่ `src/common/Entities/amec/views/user.entity.ts` แทนที่เดิมที่กระจัดกระจาย
  * ลบโมดูล `Aftsysdoc` เก่าที่ไม่ใช้งาน
* **ไฟล์หลักที่แก้ไข:**
  * `src/joborder/orderlist/`, `src/joborder/set-request-date/`
  * อัปเดต Import Entity `User` ใน `src/amec/`, `src/docinv/`, `src/gpreport/`, `src/webform/`

---

### 9. Commit `4afdd640` (ล่าสุด) : แก้ไข Entity Metadata ทั่วทั้งระบบ และสร้าง Benchmark Tools
* **Commit Message:** `feat: update database connections and add benchmark tools`
* **เหตุผลการแก้ไข:**
  * แก้ไขปัญหา `Entity metadata for ... was not found` ที่เกิดขึ้นตอน Start Dev อย่างเด็ดขาด โดยการลงทะเบียน Entity ขาดหายให้ครบถ้วน และตัดความสัมพันธ์ข้ามระบบที่ไม่จำเป็น
  * สร้าง Benchmark Tools เพื่อจับเวลา Database และวัด Phase ของ NestJS Startup
* **รายละเอียดไฟล์ที่แก้ไข:**
  1. **กลุ่ม ESCS Manufacturing (9 โมดูล):**
     * `item-sheet-mfg`, `item-mfg-history`, `item-mfg-list`, `item-mfg`, `machine`, `mfg-drawing-action`, `mfg-drawing`, `mfg-feeder`, `user-authorize`
     * เพิ่ม Entity เช่น `ITEM_MFG_LIST`, `SYS_STATUS`, `ITEM_STATUS`, `MACHINE_NAME`, `F001KP`, `AMECORDERS_PROCESS` ฯลฯ
  2. **กลุ่ม Webform:**
     * `src/webform/purform/pur-nvf/purnvf.module.ts`: เพิ่ม `PURNVF_LIST`, `PURNVF_ADDRESS`
     * `src/webform/purform/pur-vmm/purvmm_form/purvmm_form.module.ts`: เพิ่ม `TypeOrmModule.forFeature([PURVMM_FORM, PURVMM_SCMUSR, TermTrade], 'mitsuConnection')`
     * `src/webform/purform/pur-pra/pur-pra.module.ts`: เพิ่ม `TypeOrmModule.forFeature([PURPRA_FORM, PURPRA_COMMITTEE, PURPRA_GROUP, PURPRA_REASONS, PURPRA_REASON_MASTER, PURPRA_LINK_KEY_VIEW], 'mitsuConnection')`
     * `src/webform/gpform/gp-unf/gp-unf.module.ts`: เพิ่ม `GPUNF_TYPE`
     * `src/webform/isform/is-dev/is-dev.module.ts`: เพิ่ม `ISDEV_CATEGORY`, `ISDEV_TYPE`, `ISDEV_STATUS`
  3. **กลุ่ม Pursys & GpReport:**
     * `src/pursys/pur_vendors/pur_vendors.module.ts`: เพิ่ม `PurVendorsAddress`, `PurVendorsAttfile`
     * `src/pursys/stocks/stocks.module.ts`: เพิ่ม `StockTransactionsType`
     * `src/gpreport/loan/loan.module.ts`: เพิ่ม `EMP04`, `EMP05`
  4. **กลุ่ม Workload & SPProgram:**
     * `src/workload/dpms_packing_list_main/dpms_packing_list_main.module.ts`: เพิ่ม `DPMS_PACKING_LIST_DETAIL`, `DPMS_PACKING_LIST_DETAIL_PO`
     * `src/workload/dpms_pl_case_list_detail/dpms_pl_case_list_detail.module.ts`: เพิ่ม `DPMS_PL_CASE_REVISE_VGM`
     * `src/spprogram/sp.module.ts`: เพิ่ม `TypeOrmModule.forFeature([SpUser], 'mitsuConnection')`
  5. **การ Decouple Entity ข้ามระบบ:**
     * `src/common/Entities/amec/views/AMECUSERALL.entity.ts`: ปลด relation `INV_YEARLY_ASSIGN`
     * `src/common/Entities/skid/views/IMM_ITEMMST.entity.ts`: ปลด relation `RESULT` และ `YEARLY_RESULT`
  6. **เพิ่มเครื่องมือ Benchmark:**
     * `scripts/benchmark/benchmark-dev.js` สำหรับวัดการรัน `start:dev` จริง (SWC + Watcher + NestJS Startup) พร้อมพิมพ์สเปกฮาร์ดแวร์ของแต่ละเครื่อง
     * `scripts/benchmark/index.js` สำหรับวัดเวลา Production / Docker Runtime และ Ping Test ของ Database ทั้ง 8 ตัว
     * `scripts/benchmark/README.md` เอกสารการใช้งาน
     * เพิ่มสคริปต์ใน `package.json`:
       * `"benchmark:dev"`: รันวัด start:dev จริง
       * `"benchmark:prod"`: รันวัด production runtime
       * `"benchmark"`: เป็น shortcut เรียก `benchmark:dev`

---

## 📊 ผลการตรวจสอบและยืนยันคุณภาพ (Verification & Results)

1. **Broken Entity Relations:** ตรวจเช็คครบ 535 Entities ทั่วทั้งโปรเจกต์ ผลลัพธ์ = **0 จุด**
2. **Build Test:** รันคำสั่ง `npm run build` สำเร็จ 100% (Exit code 0)
3. **Unit Tests:** ชุดทดสอบ `ebudget-connection.spec.ts` ผ่านครบ **24/24 Tests**
4. **Benchmark Summary:**
   * เชื่อมต่อ Database สำเร็จครบทั้ง 8 ตัว (เวลา Ping เฉลี่ย 1-5 ms)
   * พิสูจน์แล้วว่าคอขวดของการ Start Dev อยู่ที่การโหลดไฟล์ TypeScript 2,900+ ไฟล์ขึ้น RAM ในครั้งแรก (~9 วินาที) ไม่ได้เกิดจาก Database Handshake (~0.4 วินาที)
