@extends('layout/template')

@section('content')
<input type="hidden" id="empno" value="{{ $empno }}">

<div class="jig-dashboard" data-base-url="{{ base_url() }}" data-api-url="http://amecwebtest/api">
    <div id="jig-success" class="jig-notice" role="status" hidden></div>
    <div id="jig-error" class="jig-notice" role="alert" hidden>โหลดข้อมูลไม่สำเร็จ <button type="button" id="btn-retry" class="btn btn-sm btn-light">ลองใหม่</button></div>
    <div class="row g-3 mb-3">
        <div class="col">
            <div class="jig-summary-card card-total">
                <div class="summary-title">
                    <i class="fa fa-wrench"></i> JIG ทั้งหมด
                </div>
                <div class="summary-value" id="summary-total">0</div>
            </div>
        </div>

        <div class="col">
            <div class="jig-summary-card card-completed">
                <div class="summary-title">
                    <i class="fa fa-check-square"></i> JIG ที่ตรวจแล้ว
                </div>
                <div class="summary-value" id="summary-completed">0</div>
                <div class="summary-note">อย่างน้อย 1 รอบใน FY · รวม <span id="completed-rounds">0</span> รอบ</div>
            </div>
        </div>

        <div class="col">
            <div class="jig-summary-card card-due-soon">
                <div class="summary-title">
                    <i class="fa fa-clock-o"></i> ใกล้กำหนด
                </div>
                <div class="summary-value" id="summary-due-soon">0</div>
            </div>
        </div>

        <div class="col">
            <div class="jig-summary-card card-overdue">
                <div class="summary-title">
                    <i class="fa fa-warning"></i> Overdue
                </div>
                <div class="summary-value" id="summary-overdue">0</div>
            </div>
        </div>

        <div class="col">
            <div class="jig-summary-card card-new">
                <div class="summary-title">
                    <i class="fa fa-star"></i> JIG ใหม่ FY<span id="summary-fy">26</span>
                </div>
                <div class="summary-value" id="summary-new">0</div>
            </div>
        </div>
    </div>

    <div class="jig-toolbar mb-3">
        <div class="d-flex flex-wrap align-items-center gap-2">
            <button type="button" class="btn jig-filter active" data-filter="all">
                ทั้งหมด (<span id="filter-total">0</span>)
            </button>

            <button type="button" class="btn jig-filter" data-filter="due-soon">
                ใกล้กำหนด (<span id="filter-due-soon">0</span>)
            </button>

            <button type="button" class="btn jig-filter" data-filter="new">
                JIG ใหม่ (<span id="filter-new">0</span>)
            </button>

            <button type="button" class="btn jig-filter" data-filter="6m">
                6M (<span id="filter-6m">0</span>)
            </button>

            <button type="button" class="btn jig-filter" data-filter="overdue">เกินกำหนด (<span id="filter-overdue">0</span>)</button>
            <button type="button" class="btn jig-filter" data-filter="in-progress">กำลังตรวจ (<span id="filter-in-progress">0</span>)</button>
            <button type="button" class="btn jig-filter" data-filter="no-sheet">ไม่มี Check Sheet (<span id="filter-no-sheet">0</span>)</button>
            <label for="fyear" class="jig-fy-label">ปีงบประมาณ</label>
            <select id="fyear" class="form-control jig-select" aria-label="ปีงบประมาณ"></select>
            <div class="jig-search">
                <i class="fa fa-search"></i>
                <input type="text" id="jig-search" class="form-control" aria-label="ค้นหา JIG" placeholder="ค้นหา JIG / ผู้รับผิดชอบ / Drawing..." >
            </div>

            <button type="button" class="btn btn-light border" id="btn-export">
                <i class="fa fa-file-excel-o"></i> Export CSV
            </button>

            <button type="button" class="btn btn-main ms-auto" id="btn-add-jig" disabled>
                <i class="fa fa-plus"></i> Add JIG
            </button>
        </div>
    </div>

    <p class="jig-context-note">รอบตรวจและ JIG ใหม่อ้างอิงปีงบประมาณที่เลือก ส่วนสถานะทะเบียนและวันครบกำหนดเป็นข้อมูลปัจจุบัน</p>
    <div class="jig-table-container">
        <table class="table jig-table mb-0" id="jig-table" aria-busy="true">
            <thead>
                <tr>
                    <th width="4%">No</th>
                    <th width="9%">JIG No.</th>
                    <th width="22%">JIG Name</th>
                    <th width="18%">Controller</th>
                    <th width="5%">Period</th>
                    <th width="11%">รอบตรวจใน FY</th>
                    <th width="12%">Next Inspection</th>
                    <th width="10%">Status</th>
                    <th width="9%" class="text-center">Action</th>
                </tr>
            </thead>

            <tbody id="jig-table-body">
                <tr>
                    <td colspan="9" class="text-center py-4">
                        Loading...
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="jig-pagination">
        <div id="pagination-info">
            แสดง 0-0 จาก 0 รายการ
        </div>

        <div id="pagination" class="d-flex gap-1"></div>
    </div>

    <div class="jig-legend mt-3">
        <strong>Legend:</strong>

        <span>
            <span class="legend-box legend-planned"></span>
            แผน Inspection
        </span>

        <span>
            <span class="legend-box legend-completed"></span>
            ตรวจแล้ว
        </span>

        <span>
            <span class="legend-status status-due-soon">Due Soon</span>
            เหลือ ≤ 30 วัน
        </span>

        <span>
            <span class="legend-status status-overdue">Overdue</span>
            เกินกำหนด
        </span>

        <span>
            <span class="legend-status status-new">New JIG</span>
            เพิ่งลงทะเบียน
        </span>

        <span><span class="legend-box legend-running"></span> กำลังตรวจ / รออนุมัติ</span>
        <span class="ms-auto" id="period-label"></span>
    </div>
</div>
<dialog id="jig-detail" class="jig-detail" aria-labelledby="jig-detail-title">
    <div class="jig-detail-header"><h3 id="jig-detail-title">รายละเอียด JIG</h3><button id="jig-detail-close" type="button" class="btn btn-light" aria-label="ปิดรายละเอียด">ปิด</button></div>
    <div id="jig-detail-body" aria-live="polite"></div>
</dialog>
<dialog id="jig-add" class="jig-detail" aria-labelledby="jig-add-title">
    <form id="jig-add-form">
        <div class="jig-detail-header"><h3 id="jig-add-title">เพิ่ม JIG</h3><button type="button" class="btn btn-light jig-add-cancel" aria-label="ปิดแบบฟอร์ม">ปิด</button></div>
        <p class="jig-context-note">บันทึกเป็นฉบับร่างก่อนจัดทำ Check Sheet และฟอร์มขออนุมัติลงทะเบียน</p>
        <div id="jig-add-error" class="jig-notice" role="alert" hidden></div>
        <fieldset id="jig-add-fields">
            <div class="jig-form-grid">
                <label>ผู้บันทึก (Inputer)<input id="jig-inputer" class="form-control" readonly aria-readonly="true"></label>
                <label>รหัส JIG *<input name="JIG_NO" class="form-control" required maxlength="20" autocomplete="off"></label>
                <label class="jig-field-wide">ชื่อ JIG *<input name="JIG_NAME" class="form-control" required maxlength="200"></label>
                <label>Drawing<input name="DWG" class="form-control" maxlength="100"></label>
                <label>Revision<input name="REV" class="form-control" maxlength="2"></label>
                <label>จำนวน<input name="JIG_QTY" class="form-control" type="number" min="0" max="99999" step="1"></label>
                <label>ราคา<input name="PRICE" class="form-control" type="number" min="0" max="9999999999.99" step="0.01"></label>
                <label>ผู้ผลิต<input name="MAKER" class="form-control" maxlength="100"></label>
                <label>เริ่มใช้งาน<input name="START_USE_DATE" class="form-control" type="date"></label>
                <label>Item No.<input name="ITEMNO" class="form-control" maxlength="50"></label>
                <label>ชิ้นส่วน<input name="PARTS" class="form-control" maxlength="200"></label>
                <label>Process Code<input name="PROCESS_CODE" class="form-control" maxlength="50"></label>
                <label>สถานที่<input name="LOCATION" class="form-control" maxlength="100"></label>
                <label>รหัสผู้รับผิดชอบ<input name="PIC_EMPNO" class="form-control" maxlength="5"></label>
                <label>รอบตรวจ *<select name="INSPEC_PERIOD" class="form-control" required><option value="12">12 เดือน</option><option value="6">6 เดือน</option></select></label>
                <label>เดือนกำหนดตรวจครั้งแรก<input name="NEXT_INSPEC_DATE" class="form-control" type="month" min="1900-01" max="9998-12"><small>ใช้วันที่ 1 เสมอ เว้นว่างได้สำหรับฉบับร่าง</small></label>
                <label class="jig-field-wide">หมายเหตุ<textarea name="REMARK" class="form-control" rows="3" maxlength="1000"></textarea></label>
            </div>
        </fieldset>
        <div class="jig-form-actions"><button type="button" class="btn btn-light jig-add-cancel">ยกเลิก</button><button id="jig-add-submit" type="submit" class="btn btn-inspect">บันทึก JIG</button></div>
    </form>
</dialog>
@endsection

@section('scripts')
<script>
    const jigRoot = document.querySelector('.jig-dashboard');
    const JIG_CONFIG = {
        baseUrl: jigRoot.dataset.baseUrl,
        apiUrl: jigRoot.dataset.apiUrl,
        empno: document.getElementById('empno').value,
        // Set these only when the existing form page routes are available.
        inspectionUrl: '',
        formUrl: ''
    };
</script>

<script src="{{ base_url() }}assets/scripts/jig/dashboard.js?v=jig-schema-20260908"></script>
@endsection

@section('styles')
<style>
    #body{
        margin-right: 0 !important;
        box-sizing: border-box !important;
        max-width: calc(100% - 250px) !important;
    }

    .jig-dashboard{
        padding: 8px 10px;
        font-size: 14px;
    }

    .jig-dashboard .row.g-3{
        --bs-gutter-x: 10px;
        --bs-gutter-y: 10px;
    }

    .jig-summary-card{
        background: #fff;
        border: 1px solid #dfe5ec;
        border-radius: 10px;
        padding: 10px 14px;
        min-height: 82px;
        border-top-width: 4px;
        box-shadow: 0 2px 6px rgba(30, 41, 59, .08);
        transition: .15s ease;
    }

    .jig-summary-card:hover{
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(30, 41, 59, .12);
    }

    .card-total{
        border-top-color: #234f89;
        background: linear-gradient(135deg, #ffffff 0%, #f4f8ff 100%);
    }

    .card-completed{
        border-top-color: #16a36f;
        background: linear-gradient(135deg, #ffffff 0%, #f0fbf7 100%);
    }

    .card-due-soon{
        border-top-color: #ef9000;
        background: linear-gradient(135deg, #ffffff 0%, #fff9ed 100%);
    }

    .card-overdue{
        border-top-color: #e33636;
        background: linear-gradient(135deg, #ffffff 0%, #fff3f3 100%);
    }

    .card-new{
        border-top-color: #7b3ff2;
        background: linear-gradient(135deg, #ffffff 0%, #f7f2ff 100%);
    }

    .summary-title{
        color: #4d5b70;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 6px;
        white-space: nowrap;
    }

    .summary-title i{
        margin-right: 4px;
    }

    .summary-value{
        font-size: 30px;
        font-weight: 700;
        line-height: 1;
    }

    .card-total .summary-value{ color: #234f89; }
    .card-completed .summary-value{ color: #13966a; }
    .card-due-soon .summary-value{ color: #e68200; }
    .card-overdue .summary-value{ color: #df2e2e; }
    .card-new .summary-value{ color: #7b3ff2; }

    .jig-toolbar{
        background: #eef3f8;
        padding: 7px 8px;
        border: 1px solid #dfe6ee;
        border-radius: 9px;
        box-shadow: 0 1px 3px rgba(15, 23, 42, .05);
    }

    .jig-toolbar .gap-2{
        gap: 6px !important;
    }

    .jig-filter{
        border: 1px solid #cfd8e4;
        background: #fff;
        color: #42526a;
        border-radius: 18px;
        padding: 5px 13px;
        font-size: 13px;
        font-weight: 500;
        line-height: 1.2;
        min-height: 32px;
    }

    .jig-filter:hover{
        background: #f3f7fc;
        border-color: #9eb6d5;
    }

    .jig-filter.active{
        background: #dfeaff;
        border-color: #6f9fe8;
        color: #1554a3;
        font-weight: 600;
    }

    .jig-select{
        width: 140px;
        height: 32px;
        font-size: 13px;
        padding: 3px 8px;
        border-color: #cfd8e4;
        border-radius: 7px;
    }

    .jig-search{
        position: relative;
        width: 220px;
    }

    .jig-search i{
        position: absolute;
        left: 10px;
        top: 9px;
        color: #64748b;
        z-index: 2;
        font-size: 13px;
    }

    .jig-search input{
        height: 32px;
        padding-left: 30px;
        font-size: 13px;
        border-radius: 7px;
        border-color: #cfd8e4;
    }

    #btn-export{
        height: 32px;
        padding: 4px 12px;
        font-size: 13px;
        border-radius: 7px;
        background: #fff;
    }

    #btn-export:hover{
        background: #f3f7fc;
    }

    #btn-add-jig{
        height: 34px;
        padding: 5px 16px;
        font-size: 14px;
        font-weight: 600;
        border-radius: 18px;
        background: #4f46e5;
        border-color: #4f46e5;
        box-shadow: 0 2px 5px rgba(79, 70, 229, .25);
    }

    #btn-add-jig:hover{
        background: #4338ca;
        border-color: #4338ca;
    }

    .jig-table-container{
        border: 1px solid #dce3eb;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
        box-shadow: 0 1px 4px rgba(15, 23, 42, .05);
    }

    .jig-table{
        width: 100%;
        table-layout: fixed;
        font-size: 13px;
    }

    .jig-table thead th{
        background: linear-gradient(180deg, #eef3f8 0%, #e6edf5 100%);
        color: #26364d;
        font-weight: 700;
        border-bottom: 1px solid #c8d4e1;
        padding: 8px 10px;
        vertical-align: middle;
        white-space: nowrap;
    }

    .jig-table tbody td{
        padding: 7px 10px;
        vertical-align: middle;
        border-color: #e5ebf1;
        color: #243248;
        line-height: 1.25;
        height: 44px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .jig-table tbody tr:nth-child(even){
        background: #f8fafc;
    }

    .jig-table tbody tr:hover{
        background: #edf5ff;
    }

    .jig-table tbody tr:hover td{
        color: #17345d;
    }

    .jig-table th:first-child,
    .jig-table td:first-child{
        text-align: center;
        color: #617087;
    }

    .jig-table th:nth-child(5),
    .jig-table td:nth-child(5),
    .jig-table th:nth-child(8),
    .jig-table td:nth-child(8),
    .jig-table th:nth-child(9),
    .jig-table td:nth-child(9){
        text-align: center;
    }

    .jig-link{
        display: inline-block;
        min-width: 62px;
        padding: 3px 8px;
        border: 1px solid #cad6e4;
        border-radius: 6px;
        background: #fff;
        color: #2457a6;
        font-weight: 600;
        text-align: center;
        text-decoration: none;
    }

    .jig-link:hover{
        background: #eaf2ff;
        border-color: #8eb0df;
        color: #17457f;
        text-decoration: none;
    }

    .jig-name{
        font-weight: 500;
        color: #1f2f46;
    }

    .period-6m{
        color: #dc7600 !important;
        font-weight: 700;
    }

    .next-due-soon{
        color: #df7a00 !important;
        font-weight: 700;
    }

    .next-overdue{
        color: #e03226 !important;
        font-weight: 700;
    }

    .jig-status{
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        min-width: 74px;
        padding: 4px 8px;
        border-radius: 14px;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
    }

    .status-planned{
        background: #e9eff6;
        color: #53657a;
    }

    .status-due-soon{
        background: #fff0c6;
        color: #a06400;
    }

    .status-overdue{
        background: #ffe0df;
        color: #c72d26;
    }

    .jig-table td:last-child{
        padding-left: 5px;
        padding-right: 5px;
        overflow: visible;
    }

    .btn-inspect,
    .btn-view-jig{
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 28px;
        padding: 0 6px;
        margin: 0 auto;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        line-height: 1;
        white-space: nowrap;
    }

    .btn-inspect{
        background: #234f89;
        border: 1px solid #234f89;
        color: #fff;
    }

    .btn-inspect:hover{
        background: #193c69;
        border-color: #193c69;
        color: #fff;
    }

    .btn-view-jig{
        background: #fff;
        border: 1px solid #c8d4e1;
        color: #384b63;
    }

    .btn-view-jig:hover{
        background: #edf3f8;
        border-color: #9eafc1;
        color: #243b5a;
    }

    .jig-pagination{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 0 0;
        color: #64748b;
        font-size: 12px;
    }

    .page-btn{
        min-width: 27px;
        height: 27px;
        border: 1px solid #d3dce6;
        background: #fff;
        color: #42526a;
        border-radius: 5px;
        font-size: 12px;
        cursor: pointer;
    }

    .page-btn:hover{
        background: #edf3fa;
    }

    .page-btn.active{
        background: #244c7d;
        border-color: #244c7d;
        color: #fff;
        font-weight: 600;
    }

    .page-btn:disabled{
        opacity: .4;
        cursor: default;
    }

    .page-dots{
        padding: 4px 3px;
        color: #94a3b8;
    }

    .jig-legend{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 9px;
        background: #f8fafc;
        border: 1px solid #dfe5ec;
        border-radius: 8px;
        padding: 7px 10px;
        font-size: 11px;
        color: #56657a;
    }

    .legend-box{
        display: inline-block;
        width: 11px;
        height: 11px;
        border-radius: 3px;
        margin-right: 3px;
        vertical-align: -1px;
    }

    .legend-planned{
        background: #e8f1ff;
        border: 1px solid #6aa3ff;
    }

    .legend-completed{
        background: #dff8ec;
        border: 1px solid #48c78e;
    }

    .legend-status{
        display: inline-block;
        padding: 2px 7px;
        border-radius: 10px;
        font-size: 10px;
        font-weight: 600;
    }

    @media(max-width: 1400px){
        .summary-title{ font-size: 13px; }
        .summary-value{ font-size: 27px; }
        .jig-table{ font-size: 12px; }
        .jig-table thead th{ font-size: 12px; }
    }

    @media(max-width: 1200px){
        .jig-search{ width: 180px; }

        .jig-dashboard{
            overflow-x: auto;
        }

        .jig-table{
            min-width: 1100px;
        }
    }
    .jig-dashboard .summary-note, .jig-context-note { color: #64748b; font-size: 11px; margin-top: 6px; }
    .jig-dashboard, .jig-detail { font-family: Arial, Tahoma, sans-serif; }
    .jig-dashboard .row.g-3 { display: flex; flex-wrap: wrap; align-items: stretch; gap: 10px; margin-bottom: 16px; }
    .jig-dashboard .row.g-3 > .col { flex: 1 1 165px; }
    .jig-toolbar > .d-flex { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
    .jig-table, .jig-detail-table table { border-collapse: collapse; width: 100%; }
    .jig-summary-card { height: 100%; }
    .jig-dashboard .row.g-3 > .col { min-width: 165px; }
    .jig-notice { padding: 12px; margin-bottom: 12px; background: #fff0c6; border: 1px solid #e4bf61; border-radius: 8px; }
    .jig-fy-label { margin: 0 3px 0 8px; font-size: 12px; }
    .jig-select { width: 165px; }
    .jig-search { width: 270px; }
    .jig-table-container { overflow-x: auto; }
    .jig-table { min-width: 1120px; }
    .jig-table td:nth-child(6), .jig-table td:nth-child(8), .jig-table td:nth-child(9) { white-space: normal; overflow: visible; }
    .jig-table .jig-new-row { background: #f7f2ff; }
    .schedule-container { display: flex; flex-wrap: wrap; gap: 4px; }
    .schedule-month { display: inline-block; padding: 3px 5px; border: 1px solid; border-radius: 4px; font-size: 11px; }
    .schedule-planned { background: #e8f1ff; border-color: #6aa3ff; color: #23518a; }
    .schedule-finished { background: #dff8ec; border-color: #48c78e; color: #15754d; }
    .schedule-running, .legend-running { background: #ede9fe; border-color: #9d82e8; color: #6340ac; }
    .status-running { background: #ede9fe; color: #6340ac; }
    .status-muted { background: #eef0f3; color: #586473; }
    .status-completed { background: #dff8ec; color: #15754d; }
    .status-new { background: #ede9fe; color: #6340ac; margin-left: 3px; }
    .jig-status { margin: 2px 0; min-width: auto; }
    .jig-table .btn-view-jig, .jig-table .btn-inspect, .btn-view-form { width: auto; min-width: 64px; margin: 2px 0; padding: 5px 8px; }
    .btn-view-form { border: 1px solid #c8d4e1; background: #fff; border-radius: 6px; color: #384b63; font-size: 11px; }
    .jig-dashboard button:disabled { opacity: .5; cursor: not-allowed; }
    .jig-detail { width: min(920px, 92vw); max-height: 85vh; overflow: auto; border: 1px solid #dce3eb; border-radius: 12px; padding: 20px; color: #243248; }
    .jig-detail::backdrop { background: rgba(15, 23, 42, .45); }
    .jig-detail-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
    .jig-detail h3 { margin: 0; font-size: 19px; }
    .jig-detail h4 { margin: 20px 0 10px; font-size: 16px; }
    .jig-detail-table { overflow-x: auto; }
    .jig-detail-table th, .jig-detail-table td { padding: 8px; border-bottom: 1px solid #dce3eb; font-size: 13px; overflow-wrap: anywhere; }
    .jig-form-history > div { padding: 8px 0; border-bottom: 1px solid #dce3eb; }
    .jig-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
    .jig-form-grid label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; }
    .jig-form-grid input, .jig-form-grid select, .jig-form-grid textarea { box-sizing: border-box; width: 100%; padding: 8px; border: 1px solid #cfd8e4; border-radius: 6px; font: inherit; }
    .jig-form-grid input[readonly] { background: #eef3f8; }
    .jig-field-wide { grid-column: 1 / -1; }
    .jig-form-grid small { color: #64748b; }
    #jig-add-fields { border: 0; padding: 0; margin: 0; min-width: 0; }
    .jig-form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
    #jig-add-submit { width: auto; height: auto; padding: 9px 16px; }
    #jig-success { background: #dff8ec; border-color: #48c78e; }
    @media(max-width: 600px) { .jig-form-grid { grid-template-columns: 1fr; } }
    @media(max-width: 768px) { .jig-search { width: 100%; } .jig-pagination { gap: 8px; flex-wrap: wrap; } }
</style>
@endsection
