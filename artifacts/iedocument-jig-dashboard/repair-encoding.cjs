const fs = require('fs');
const root = __dirname + '/';
let js = fs.readFileSync(root + 'assets/scripts/jig/dashboard.js', 'utf8');
function line(needle, text) {
    const lines = js.split('\n');
    const i = lines.findIndex(value => value.includes(needle));
    if (i < 0) throw new Error(needle);
    lines[i] = text;
    js = lines.join('\n');
}
line(".attr('title', JIG_CONFIG.addUrl", "        $('#btn-add-jig').prop('disabled', !JIG_CONFIG.addUrl).attr('title', JIG_CONFIG.addUrl ? 'เพิ่ม JIG' : 'ยังไม่ได้เชื่อมหน้าลงทะเบียน JIG');");
line(".not('#summary-fy').text", "            $('[id^=\"summary-\"], [id^=\"filter-\"]').not('#summary-fy').text('—');");
line('Dashboard ???', "            $('#jig-table-body').html('<tr><td colspan=\"9\" class=\"text-center py-4\">ไม่สามารถโหลดข้อมูล Dashboard ได้ กรุณาลองใหม่</td></tr>');");
line('const state = { COMPLETED:', "            const state = { COMPLETED: ['schedule-finished', 'อนุมัติครบแล้ว'], IN_PROGRESS: ['schedule-running', 'กำลังตรวจ / รออนุมัติ'] }[schedule.STATUS] || ['schedule-planned', 'แผนตรวจ'];");
line("OVERDUE: ['status-overdue'", "            OVERDUE: ['status-overdue', 'เกินกำหนด'], DUE_SOON: ['status-due-soon', 'ใกล้กำหนด'], PLANNED: ['status-planned', 'ตามแผน'],");
line("NO_SHEET: ['status-overdue'", "            NO_SHEET: ['status-overdue', 'ไม่มี Check Sheet'], IN_PROGRESS: ['status-running', 'กำลังตรวจ'], AWAITING_SYNC: ['status-due-soon', 'รออัปเดตรอบ'],");
line("UNSCHEDULED: ['status-muted'", "            UNSCHEDULED: ['status-muted', 'ยังไม่กำหนดรอบ'], DRAFT: ['status-muted', 'ฉบับร่าง'], PENDING: ['status-running', 'รออนุมัติลงทะเบียน'],");
line("ACTIVE: ['status-completed'", "            ACTIVE: ['status-completed', 'ใช้งาน'], INACTIVE: ['status-muted', 'หยุดใช้งาน'], PENDING_DELETE: ['status-due-soon', 'รออนุมัติลบ'],");
line("DELETED: ['status-muted'", "            DELETED: ['status-muted', 'ลบแล้ว'], TRANSFERRED: ['status-muted', 'โอนย้ายแล้ว']");
line('const state = states[status]', "        const state = states[status] || ['status-muted', status || 'ไม่ระบุสถานะ'];");
line('if (item.CURRENT_FORM) return', "        if (item.CURRENT_FORM) return this.formButton(item.CURRENT_FORM, 'ดูฟอร์ม');");
line("(JIG_CONFIG.inspectionUrl ? ''", "            (JIG_CONFIG.inspectionUrl ? '' : 'disabled title=\"ยังไม่ได้เชื่อมหน้าฟอร์มตรวจสอบ\"') + '>ตรวจสอบ</button> ' : '';");
line('return inspect +', "        return inspect + '<button type=\"button\" class=\"btn btn-sm btn-view-jig\" data-jig=\"' + jig + '\">รายละเอียด</button>';");
line("$('#jig-detail-body').text('??????????');", "        $('#jig-detail-body').text('กำลังโหลด…');");
line('const esc = value =>', "        const esc = value => this.escapeHtml(value ?? '—');");
line('(rows.length ? rows.map', "            (rows.length ? rows.map(row => '<tr>' + row.map(value => '<td>' + esc(value) + '</td>').join('') + '</tr>').join('') : '<tr><td colspan=\"' + headers.length + '\">ไม่มีข้อมูล</td></tr>') + '</tbody></table></div>';");
line("this.openDetail('???????????????')", "        this.openDetail('รายละเอียดฟอร์ม');");
line("let html = this.detailTable(['??????', '???'], [ ['JIG'", "            let html = this.detailTable(['ข้อมูล', 'ค่า'], [['JIG', form.JIG_NO], ['ประเภท', form.FORM_TYPE], ['กำหนดตรวจ', this.formatMonthYear(form.SCHEDULE_DATE)], ['วันที่ตรวจจริง', this.formatDate(form.CHECK_DATE)], ['ผู้ตรวจ', form.INSPECTOR_EMPNO], ['ผลรวม', form.OVERALL_RESULT], ['สถานะฟอร์ม', this.formStatusLabel(form.FORM_STATUS)]]);");
line("html += '<h4>??????</h4>'", "            html += '<h4>ผลตรวจ</h4>' + this.detailTable(['ข้อ', 'จุดตรวจ', 'เครื่องมือ', 'Min', 'Max', 'ค่าที่วัด', 'หน่วย', 'ผล'], (form.DETAILS || []).map(d => [d.CHECK_SEQ, d.CHECK_POINT, d.INSPECTION_TOOL, d.MIN, d.MAX, d.MEASURED_VALUE, d.UNIT, d.RESULT]));");
line('if (form.NG) html', "            if (form.NG) html += '<h4>การแก้ไข NG</h4>' + this.detailTable(['ข้อมูล', 'ค่า'], [['ข้อบกพร่อง', form.NG.DEFECT_DETAIL], ['วิธีแก้ไข', form.NG.ACCESS_METHOD], ['แผนดำเนินการ', this.formatDate(form.NG.PLAN_DATE)], ['สถานที่', form.NG.LOCATION]]);");
line("html += '<h4>???????</h4>'", "            html += '<h4>ไฟล์แนบ</h4>' + this.detailTable(['ชื่อไฟล์', 'ชนิด', 'ขนาด (bytes)'], (form.FILES || []).map(file => [file.FILE_NAME, file.FILE_TYPE, file.FILE_SIZE]));");
line(".text('???????????????????????????????", "        } catch (error) { if (requestId === this.detailRequestId) $('#jig-detail-body').text('ไม่สามารถโหลดรายละเอียดฟอร์มได้ กรุณาปิดแล้วลองใหม่'); }");
line("return { '0':", "        return { '0': 'เตรียมฟอร์ม', '1': 'กำลังดำเนินการ', '2': 'อนุมัติครบแล้ว', '3': 'ไม่อนุมัติ' }[String(status).trim()] || 'ไม่ระบุสถานะ';");
line("let html = this.detailTable(['??????', '???'], [ ['????'", "            let html = this.detailTable(['ข้อมูล', 'ค่า'], [['ชื่อ', jig.JIG_NAME], ['Drawing', jig.DWG], ['Revision', jig.REV], ['สถานที่', jig.LOCATION], ['ผู้รับผิดชอบ', jig.PIC_EMPNO], ['รอบตรวจ', this.getInspectionPeriod(jig)], ['กำหนดถัดไป', this.formatMonthYear(jig.NEXT_INSPEC_DATE)], ['สถานะทะเบียน', jig.JIG_STATUS], ['หมายเหตุ', jig.REMARK]]);");
line("html += '<h4>Check Sheet", "            html += '<h4>Check Sheet</h4>' + this.detailTable(['ข้อ', 'จุดตรวจ', 'เครื่องมือ', 'Min', 'Max', 'หน่วย'], points.map(p => [p.CHECK_SEQ, p.CHECK_POINT, p.INSPECTION_TOOL, p.MIN, p.MAX, p.UNIT]));");
line("html += '<h4>????????????", "            html += '<h4>ประวัติฟอร์ม</h4><div class=\"jig-form-history\">' + (forms.map(f => '<div>' + this.escapeHtml(f.FORM_TYPE + ' · ' + this.formatMonthYear(f.SCHEDULE_DATE) + ' · ' + this.formStatusLabel(f.FORM_STATUS)) + ' ' + this.formButton(f, 'ดูฟอร์ม') + '</div>').join('') || 'ไม่มีฟอร์ม') + '</div>';");
line(".text('??????????????????????? JIG", "        } catch (error) { if (requestId === this.detailRequestId) $('#jig-detail-body').text('ไม่สามารถโหลดรายละเอียด JIG ได้ กรุณาปิดแล้วลองใหม่'); }");
js = js.replaceAll('Apr?Mar', 'Apr–Mar').replaceAll("' ? '", "' — '").replaceAll('text-muted\">?</span>', 'text-muted\">—</span>').replace("$('#pagination-info').text('??????????');", "$('#pagination-info').text('กำลังโหลด…');").replace(" : '?';", " : '—';");
fs.writeFileSync(root + 'assets/scripts/jig/dashboard.js', js);
let view = fs.readFileSync(root + 'application/views/jig/dashboard.blade.php', 'utf8');
const replacements = [
['??????????????????? <button', 'โหลดข้อมูลไม่สำเร็จ <button'], ['>???????</button></div>', '>ลองใหม่</button></div>'],
['????????? 1 ????? FY ? ???', 'อย่างน้อย 1 รอบใน FY · รวม'], ['</span> ???</div>', '</span> รอบ</div>'],
['data-filter="overdue">?????????', 'data-filter="overdue">เกินกำหนด'], ['data-filter="in-progress">?????????', 'data-filter="in-progress">กำลังตรวจ'],
['????? Check Sheet', 'ไม่มี Check Sheet'], ['>??????????</label>', '>ปีงบประมาณ</label>'], ['aria-label="??????????"', 'aria-label="ปีงบประมาณ"'],
['?????????? JIG ????????????????????????????? ????????????????????????????????????????????????', 'รอบตรวจและ JIG ใหม่อ้างอิงปีงบประมาณที่เลือก ส่วนสถานะทะเบียนและวันครบกำหนดเป็นข้อมูลปัจจุบัน'],
['????????? FY', 'รอบตรวจใน FY'], ['????????? / ?????????', 'กำลังตรวจ / รออนุมัติ'], ['>?????????? JIG</h3>', '>รายละเอียด JIG</h3>'],
['aria-label="?????????????">???', 'aria-label="ปิดรายละเอียด">ปิด'], ['fa-check-square"></i> ตรวจแล้ว', 'fa-check-square"></i> JIG ที่ตรวจแล้ว'],
['placeholder="ค้นหา JIG / Controller..."', 'aria-label="ค้นหา JIG" placeholder="ค้นหา JIG / ผู้รับผิดชอบ / Drawing..."'],
];
for (const [from, to] of replacements) view = view.replaceAll(from, to);
fs.writeFileSync(root + 'application/views/jig/dashboard.blade.php', view);
