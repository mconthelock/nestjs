$(document).ready(function () {
    JigDashboard.init();
});

const JigDashboard = {
    data: [],
    filteredData: [],
    currentPage: 1,
    pageSize: 10,
    currentFilter: 'all',
    searchText: '',
    asOf: null,
    dueSoonDays: 30,
    detailRequest: 0,
    historyForms: [],
    loadRequest: 0,

    async init() {
        this.ensureExtraSummary();
        this.bindEvents();
        $('#btn-add-jig').prop('disabled', true).attr('title', 'รอจัดทำหน้า Create form');
        await this.loadDashboard();
    },

    bindEvents() {
        $(document).on('click', '.jig-filter', function () {
            $('.jig-filter').removeClass('active');
            $(this).addClass('active');

            JigDashboard.currentFilter = $(this).data('filter');
            JigDashboard.currentPage = 1;
            JigDashboard.applyFilter();
        });

        $('#jig-search').on('input', function () {
            JigDashboard.searchText = $(this).val().trim().toLowerCase();
            JigDashboard.currentPage = 1;
            JigDashboard.applyFilter();
        });

        $('#btn-export').on('click', function () {
            JigDashboard.exportExcel();
        });

        $('#btn-add-jig').on('click', function () {
            JigDashboard.openAddJig();
        });

        $(document).on('click', '.page-btn', function () {
            const page = Number($(this).data('page'));

            if (!page || page === JigDashboard.currentPage) return;

            JigDashboard.currentPage = page;
            JigDashboard.renderTable();
        });

        $(document).on('click', '.btn-inspect', function () {
            const jigNo = $(this).attr('data-jig');
            JigDashboard.openInspection(jigNo);
        });

        $(document).on('click', '.btn-view-jig', function () {
            const jigNo = $(this).attr('data-jig');
            JigDashboard.viewJig(jigNo);
        });

        $(document).on('click', '.jig-history-form', function () {
            const index = Number($(this).attr('data-index'));
            const form = JigDashboard.historyForms[index];
            if (form) JigDashboard.viewForm(form);
        });
        $('#btn-refresh-jig').on('click', () => this.loadDashboard());
    },

    ensureExtraSummary() {
        // The supplied view may not yet contain the new counters.
        if (!$('#summary-planned').length) {
            const bar = $('<div class="jig-extra-summary" style="margin:12px 0;display:flex;gap:16px;flex-wrap:wrap"></div>');
            bar.append('<span>ยังไม่ถึงกำหนด: <strong id="summary-planned">0</strong></span>');
            if (!$('#summary-unscheduled').length) {
                bar.append('<span>ยังไม่กำหนดวัน: <strong id="summary-unscheduled">0</strong></span>');
            }
            const table = $('#jig-table-body').closest('table');
            if (table.length) bar.insertBefore(table);
        }
    },

    async apiGet(path) {
        const config = typeof JIG_CONFIG !== 'undefined' ? JIG_CONFIG : {};
        if (!config.apiUrl) throw new Error('ยังไม่ได้ตั้งค่า JIG_CONFIG.apiUrl');
        const response = await fetch(`${String(config.apiUrl).replace(/\/+$/, '')}/iedoc/jig${path}`, {
            method: 'GET', headers: { Accept: 'application/json' }, cache: 'no-store'
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    },

    async loadDashboard() {
        const requestId = ++this.loadRequest;
        this.showLoading();

        try {
            const result = await this.apiGet('/dashboard');
            if (requestId !== this.loadRequest) return;
            if (!result || !Array.isArray(result.items)) throw new Error('รูปแบบ response ไม่มี items');
            this.data = result.items;
            this.asOf = result.asOf || null;
            this.dueSoonDays = Number.isFinite(Number(result.dueSoonDays)) ? Number(result.dueSoonDays) : 30;

            this.renderSummary(result.summary || {});
            this.renderAsOf();
            this.applyFilter();

        } catch (error) {
            if (requestId !== this.loadRequest) return;
            console.error('JIG Dashboard Error:', error);

            this.data = [];
            this.filteredData = [];
            this.asOf = null;
            this.renderSummary({});
            $('[id^="summary-"]').text('-');
            this.renderAsOf();

            $('#jig-table-body').html(`
                <tr>
                    <td colspan="9" class="text-center text-danger py-4">
                        <i class="fa fa-exclamation-triangle"></i>
                        ไม่สามารถโหลดข้อมูล Dashboard ได้ (${this.escapeHtml(error.message)})
                    </td>
                </tr>
            `);

            this.renderPagination(0, 0, 0);
        }
    },

    renderSummary(summary) {
        $('#summary-total').text(Number(summary.total ?? this.data.length));
        $('#summary-due').text(Number(summary.dueToday || 0));
        $('#summary-due-soon').text(Number(summary.dueSoon || 0));
        $('#summary-overdue').text(Number(summary.overdue || 0));
        $('#summary-unscheduled').text(Number(summary.unscheduled || 0));
        $('#summary-planned').text(Number(summary.planned ?? this.data.filter(item => this.getStatus(item) === 'PLANNED').length));
        $('#summary-due-soon').attr('title', `ครบกำหนดภายใน ${this.dueSoonDays} วัน`);
        $('#filter-planned').text(this.data.filter(item => this.getStatus(item) === 'PLANNED').length);
        $('#filter-unscheduled').text(this.data.filter(item => this.getStatus(item) === 'UNSCHEDULED').length);

        $('#filter-total').text(this.data.length);
        $('#filter-due').text(
            this.data.filter(item => this.getStatus(item) === 'DUE').length
        );
        $('#filter-due-soon').text(
            this.data.filter(item => this.getStatus(item) === 'DUE_SOON').length
        );
        $('#filter-overdue').text(
            this.data.filter(item => this.getStatus(item) === 'OVERDUE').length
        );
        $('#filter-12m').text(
            this.data.filter(item => Number(item.INSPEC_PERIOD) === 12).length
        );
        $('#filter-6m').text(
            this.data.filter(item => Number(item.INSPEC_PERIOD) === 6).length
        );
    },

    applyFilter() {
        let items = [...this.data];

        switch (this.currentFilter) {
            case 'planned':
                items = items.filter(item => this.getStatus(item) === 'PLANNED');
                break;
            case 'unscheduled':
                items = items.filter(item => this.getStatus(item) === 'UNSCHEDULED');
                break;
            case 'due':
                items = items.filter(item =>
                    this.getStatus(item) === 'DUE'
                );
                break;

            case 'due-soon':
                items = items.filter(item =>
                    this.getStatus(item) === 'DUE_SOON'
                );
                break;

            case 'overdue':
                items = items.filter(item =>
                    this.getStatus(item) === 'OVERDUE'
                );
                break;

            case '12m':
                items = items.filter(item =>
                    Number(item.INSPEC_PERIOD) === 12
                );
                break;

            case '6m':
                items = items.filter(item =>
                    Number(item.INSPEC_PERIOD) === 6
                );
                break;
        }

        if (this.searchText) {
            items = items.filter(item => {
                const jigNo = String(item.JIG_NO || '').toLowerCase();
                const jigName = String(item.JIG_NAME || '').toLowerCase();
                const picName = String(item.SNAME || item.PIC_NAME || '').toLowerCase();
                const picEmpno = String(item.PIC_EMPNO || '').toLowerCase();
                const process = String(item.PROCESS_CODE || '').toLowerCase();

                return (
                    jigNo.includes(this.searchText) ||
                    jigName.includes(this.searchText) ||
                    picName.includes(this.searchText) ||
                    picEmpno.includes(this.searchText) ||
                    process.includes(this.searchText)
                );
            });
        }

        this.filteredData = items;
        this.renderTable();
    },

    renderTable() {
        const $tbody = $('#jig-table-body');
        $tbody.empty();

        const total = this.filteredData.length;
        const totalPages = Math.ceil(total / this.pageSize);

        if (this.currentPage > totalPages && totalPages > 0) {
            this.currentPage = totalPages;
        }

        if (total === 0) {
            this.currentPage = 1;
            $tbody.html(`
                <tr>
                    <td colspan="9" class="text-center text-muted py-4">
                        ไม่พบข้อมูล
                    </td>
                </tr>
            `);

            this.renderPagination(0, 0, 0);
            return;
        }

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, total);
        const pageItems = this.filteredData.slice(startIndex, endIndex);

        pageItems.forEach((item, index) => {
            const no = startIndex + index + 1;
            const controller = this.getControllerName(item);
            const period = this.getInspectionPeriod(item);
            const schedule = this.renderSchedule(item);
            const nextInspection = this.formatMonthYear(item.NEXT_INSPEC_DATE);
            const statusCode = this.getStatus(item);
            const status = this.renderStatus(statusCode);
            const action = this.renderAction(item);
            const isSixMonth = Number(item.INSPEC_PERIOD) === 6;

            $tbody.append(`
                <tr>
                    <td class="row-number">${no}</td>

                    <td>
                        <a href="javascript:void(0)"
                           class="jig-link btn-view-jig"
                           data-jig="${this.escapeHtml(item.JIG_NO)}">
                            ${this.escapeHtml(item.JIG_NO)}
                        </a>
                    </td>

                    <td>
                        <span class="jig-name">
                            ${this.escapeHtml(item.JIG_NAME || '-')}
                        </span>
                    </td>

                    <td>
                        ${this.escapeHtml(controller)}
                    </td>

                    <td class="${isSixMonth ? 'period-6m' : ''}">
                        ${period}
                    </td>

                    <td>
                        <div class="schedule-container">
                            ${schedule}
                        </div>
                    </td>

                    <td class="${this.getNextInspectionClass(statusCode)}">
                        ${nextInspection}
                        <small style="display:block">${this.escapeHtml(this.getDueText(item))}</small>
                    </td>

                    <td>
                        ${status}
                    </td>

                    <td class="text-center">
                        ${action}
                    </td>
                </tr>
            `);
        });

        this.renderPagination(startIndex + 1, endIndex, total);
    },

    renderSchedule(item) {
        const date = this.parseDate(item.NEXT_INSPEC_DATE);

        if (!date) return '-';

        const hues = [
            210, 270, 330, 150, 35, 185,
            240, 15, 290, 80, 170, 350
        ];

        const hue = hues[date.getMonth()];

        return '<span style="display:inline-block;padding:5px 12px;border-radius:8px;font-weight:700;background:hsl(' +
            hue +
            ',80%,94%);color:hsl(' +
            hue +
            ',70%,28%);border:1px solid hsl(' +
            hue +
            ',65%,78%)" title="เดือนตรวจครั้งถัดไป">' +
            this.getMonthShort(date.getMonth()) +
            '</span>';
    },

    renderStatus(status) {
        switch (status) {
            case 'OVERDUE':
                return `
                    <span class="jig-status status-overdue">
                        <i class="fa fa-circle"></i> Overdue
                    </span>
                `;

            case 'DUE':
                return `
                    <span class="jig-status status-due">
                        <i class="fa fa-circle"></i> Due
                    </span>
                `;

            case 'DUE_SOON':
                return `
                    <span class="jig-status status-due-soon">
                        <i class="fa fa-circle"></i> Due Soon
                    </span>
                `;

            case 'UNSCHEDULED':
                return `
                    <span class="jig-status status-unscheduled">
                        <i class="fa fa-circle"></i> Unscheduled
                    </span>
                `;

            default:
                return `
                    <span class="jig-status status-planned">
                        <i class="fa fa-circle"></i> Planned
                    </span>
                `;
        }
    },

    renderAction(item) {
        const status = this.getStatus(item);
        const isDue = typeof item.IS_DUE === 'boolean'
            ? item.IS_DUE
            : status === 'DUE' || status === 'OVERDUE';

        if (isDue) {
            return `
                <button type="button"
                        class="btn btn-sm btn-inspect" disabled title="รอจัดทำหน้า Create form สำหรับตรวจสอบ"
                        data-jig="${this.escapeHtml(item.JIG_NO)}">
                    ตรวจสอบ
                </button>
            `;
        }

        return `
            <button type="button"
                    class="btn btn-sm btn-view-jig"
                    data-jig="${this.escapeHtml(item.JIG_NO)}">
                ดูข้อมูล
            </button>
        `;
    },

    renderPagination(start, end, total) {
        const $pagination = $('#pagination');

        $('#pagination-info').text(
            total
                ? `แสดง ${start}-${end} จาก ${total} รายการ`
                : 'แสดง 0-0 จาก 0 รายการ'
        );

        $pagination.empty();

        const totalPages = Math.ceil(total / this.pageSize);

        if (totalPages <= 1) return;

        const prevDisabled =
            this.currentPage === 1 ? 'disabled' : '';

        $pagination.append(`
            <button type="button"
                    class="page-btn page-arrow"
                    data-page="${this.currentPage - 1}"
                    ${prevDisabled}>
                ‹
            </button>
        `);

        const pages = this.getPaginationPages(totalPages);

        pages.forEach(page => {
            if (page === '...') {
                $pagination.append(`
                    <span class="page-dots">...</span>
                `);
                return;
            }

            $pagination.append(`
                <button type="button"
                        class="page-btn ${page === this.currentPage ? 'active' : ''}"
                        data-page="${page}">
                    ${page}
                </button>
            `);
        });

        const nextDisabled =
            this.currentPage === totalPages ? 'disabled' : '';

        $pagination.append(`
            <button type="button"
                    class="page-btn page-arrow"
                    data-page="${this.currentPage + 1}"
                    ${nextDisabled}>
                ›
            </button>
        `);
    },

    getPaginationPages(totalPages) {
        if (totalPages <= 5) {
            return Array.from(
                {length: totalPages},
                (_, index) => index + 1
            );
        }

        if (this.currentPage <= 3) {
            return [1, 2, 3, 4, '...', totalPages];
        }

        if (this.currentPage >= totalPages - 2) {
            return [
                1,
                '...',
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
            ];
        }

        return [
            1,
            '...',
            this.currentPage - 1,
            this.currentPage,
            this.currentPage + 1,
            '...',
            totalPages
        ];
    },

    renderAsOf() {
        if (!this.asOf) {
            $('#as-of-label').text('');
            return;
        }

        const date = this.parseDate(this.asOf);

        if (!date) {
            $('#as-of-label').text('');
            return;
        }

        $('#as-of-label').text(
            `ข้อมูล ณ ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
        );
    },

    getStatus(item) {
        return String(
            item.DUE_STATUS ||
            item.DASHBOARD_STATUS ||
            'UNSCHEDULED'
        ).trim().toUpperCase();
    },

    getDueText(item) {
        const value = item.DAYS_UNTIL_DUE;
        if (value === null || value === undefined || value === '') {
            return this.getStatus(item) === 'UNSCHEDULED' ? 'ยังไม่กำหนดวันตรวจ' : '';
        }
        const days = Number(value);
        if (!Number.isFinite(days)) return '';
        if (days < 0) return `เกินกำหนด ${Math.abs(days)} วัน`;
        if (days === 0) return 'ครบกำหนดวันนี้';
        return `เหลือ ${days} วัน`;
    },

    getControllerName(item) {
        const empno = String(item.PIC_EMPNO || '').trim();
        const name = String(item.SNAME || item.PIC_NAME || '').trim();

        return [
            empno ? '(' + empno + ')' : '',
            name
        ].filter(Boolean).join(' ') || '-';
    },

    getInspectionPeriod(item) {
        const period = Number(item.INSPEC_PERIOD);

        if (!period) return '-';

        if (period === 12) return '12M';

        return `${period}M`;
    },

    getNextInspectionClass(status) {
        if (status === 'OVERDUE') return 'next-overdue';
        if (status === 'DUE' || status === 'DUE_SOON') {
            return 'next-due-soon';
        }

        return '';
    },

    formatMonthYear(value) {
        const date = this.parseDate(value);

        if (!date) return '-';

        return `${this.getMonthShort(date.getMonth())} ${date.getFullYear()}`;
    },

    parseDate(value) {
        if (!value) return null;

        if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
            const [y, m, d] = value.split('-').map(Number);
            return new Date(y, m - 1, d);
        }

        const instant = new Date(value);

        if (Number.isNaN(instant.getTime())) return null;

        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        }).formatToParts(instant);

        const part = type =>
            Number(parts.find(p => p.type === type).value);

        return new Date(
            part('year'),
            part('month') - 1,
            part('day')
        );
    },

    getMonthShort(month) {
        return [
            'Jan', 'Feb', 'Mar', 'Apr',
            'May', 'Jun', 'Jul', 'Aug',
            'Sep', 'Oct', 'Nov', 'Dec'
        ][month];
    },

    showLoading() {
        $('#jig-table-body').html(`
            <tr>
                <td colspan="9" class="text-center py-4">
                    <i class="fa fa-spinner fa-spin"></i>
                    Loading...
                </td>
            </tr>
        `);
    },

    exportExcel() {
        if (!this.filteredData.length) {
            alert('ไม่มีข้อมูลสำหรับ Export');
            return;
        }

        const rows = [
            [
                'No',
                'JIG No.',
                'JIG Name',
                'Controller',
                'Period',
                'Next Inspection',
                'Status',
                'Days Until Due'
            ]
        ];

        this.filteredData.forEach((item, index) => {
            rows.push([
                index + 1,
                item.JIG_NO || '',
                item.JIG_NAME || '',
                this.getControllerName(item),
                this.getInspectionPeriod(item),
                this.formatMonthYear(item.NEXT_INSPEC_DATE),
                this.getStatus(item),
                item.DAYS_UNTIL_DUE ?? ''
            ]);
        });

        const csv = rows
            .map(row => row.map(value => this.csvCell(value)).join(','))
            .join('\r\n');

        const blob = new Blob(
            ['\ufeff' + csv],
            {type: 'text/csv;charset=utf-8;'}
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `JIG_Dashboard_${this.asOf || 'current'}.csv`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    },

    openAddJig() {
        alert('ส่วน Create form ยังไม่เปิดใช้งาน');
        /*
         * Modal Add JIG จะทำในขั้นถัดไป
         */
    },

    openInspection(jigNo) {
        alert('ส่วน Create form สำหรับตรวจสอบยังไม่เปิดใช้งาน');
        /*
         * Modal Inspection จะทำในขั้นถัดไป
         */
    },

    csvCell(value) {
        let text = String(value ?? '');
        // Protect spreadsheet exports from formulas in text returned by the API.
        if (typeof value === 'string' && /^[\s]*[=+\-@]/.test(text)) text = "'" + text;
        return `"${text.replace(/"/g, '""')}"`;
    },

    showInfo(title, content) {
        let dialog = document.getElementById('jig-info-dialog');
        if (!dialog) {
            dialog = document.createElement('dialog');
            dialog.id = 'jig-info-dialog';
            dialog.setAttribute('aria-labelledby', 'jig-info-title');
            dialog.style.cssText = 'width:min(960px,94vw);max-height:88vh;padding:24px;border:1px solid #ddd;border-radius:12px;overflow:auto';
            dialog.addEventListener('close', () => { this.detailRequest += 1; });
            document.body.appendChild(dialog);
        }
        dialog.innerHTML = `
            <div style="display:flex;justify-content:space-between;gap:16px;align-items:center;margin-bottom:16px">
                <h3 id="jig-info-title" style="margin:0">${this.escapeHtml(title)}</h3>
                <button type="button" class="btn btn-default jig-info-close">ปิด</button>
            </div>
            <div id="jig-info-content">${content}</div>`;
        dialog.querySelector('.jig-info-close').onclick = () => dialog.close();
        if (!dialog.open) dialog.showModal();
    },

    renderFields(fields) {
        return '<table class="table table-bordered"><tbody>' + fields.map(([label, value]) =>
            `<tr><th style="width:35%">${this.escapeHtml(label)}</th><td style="white-space:pre-wrap;overflow-wrap:anywhere">${this.escapeHtml(value === null || value === undefined || value === '' ? '-' : value)}</td></tr>`
        ).join('') + '</tbody></table>';
    },

    formatFullDate(value) {
        const date = this.parseDate(value);
        return date ? `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}` : '-';
    },

    jigFields(item) {
        return [
            ['JIG No.', item.JIG_NO], ['JIG Name', item.JIG_NAME],
            ['Drawing', item.DWG], ['Revision', item.REV], ['จำนวน', item.JIG_QTY],
            ['ราคา', item.PRICE], ['Maker', item.MAKER],
            ['วันที่เริ่มใช้', this.formatFullDate(item.START_USE_DATE)],
            ['Item No.', item.ITEMNO], ['รายละเอียด', item.JIG_DESC],
            ['MFG Process', item.PROCESS_CODE], ['Location', item.LOCATION],
            ['PIC', this.getControllerName(item)],
            ['รอบตรวจ', this.getInspectionPeriod(item)], ['หมายเหตุ', item.REMARK]
        ];
    },

    workflowLabel(status) {
        return ({ '0': 'เตรียมฟอร์ม', '1': 'อยู่ระหว่างอนุมัติ', '2': 'อนุมัติแล้ว', '3': 'ไม่อนุมัติ' })[String(status).trim()] || String(status ?? '-');
    },

    async viewJig(jigNo) {
        if (!jigNo) return;
        const requestId = ++this.detailRequest;
        this.historyForms = [];
        this.showInfo(`รายละเอียด ${jigNo}`, '<p role="status">กำลังโหลดข้อมูล…</p>');
        const path = '/' + encodeURIComponent(jigNo);
        const [master, history] = await Promise.allSettled([this.apiGet(path), this.apiGet(path + '/forms')]);
        if (requestId !== this.detailRequest) return;
        let html = '';
        if (master.status === 'fulfilled' && master.value && typeof master.value === 'object' && !Array.isArray(master.value)) {
            const current = this.data.find(item => String(item.JIG_NO) === String(jigNo)) || {};
            const item = { ...current, ...master.value };
            html += this.renderFields([
                ...this.jigFields(item), ['สถานะในระบบ', item.JIG_STATUS],
                ['วันตรวจครั้งถัดไป', this.formatFullDate(item.NEXT_INSPEC_DATE)]
            ]);
        } else {
            html += '<p class="text-danger">โหลดรายละเอียด Jig ไม่สำเร็จ</p>';
        }
        html += '<h4>ประวัติฟอร์ม</h4>';
        if (history.status !== 'fulfilled' || !Array.isArray(history.value)) {
            html += '<p class="text-danger">โหลดประวัติไม่สำเร็จ กรุณาปิดและเปิดดูใหม่</p>';
        } else {
            this.historyForms = history.value;
            html += history.value.length ? '<div style="overflow:auto"><table class="table table-bordered"><thead><tr><th>เลขที่</th><th>ประเภท</th><th>วันที่ขอ</th><th>สถานะ</th><th></th></tr></thead><tbody>' +
                history.value.map((form, index) => `<tr>
                    <td>${this.escapeHtml(form.CYEAR2)}/${this.escapeHtml(form.NRUNNO)}</td>
                    <td>${this.escapeHtml(form.FORM_TYPE)}</td>
                    <td>${this.escapeHtml(this.formatFullDate(form.FORM_DATE))}</td>
                    <td>${this.escapeHtml(this.workflowLabel(form.FORM_STATUS))}</td>
                    <td><button type="button" class="btn btn-sm btn-default jig-history-form" data-index="${index}">ดูฟอร์ม</button></td>
                </tr>`).join('') + '</tbody></table></div>' : '<p>ยังไม่มีประวัติฟอร์ม</p>';
        }
        this.showInfo(`รายละเอียด ${jigNo}`, html);
    },

    async viewForm(key) {
        const columns = ['NFRMNO', 'VORGNO', 'CYEAR', 'CYEAR2', 'NRUNNO'];
        if (columns.some(column => key[column] === null || key[column] === undefined)) {
            alert('ไม่พบ key ของฟอร์มครบทั้ง 5 ค่า');
            return;
        }
        const requestId = ++this.detailRequest;
        this.showInfo('ข้อมูลฟอร์มย้อนหลัง', '<p role="status">กำลังโหลดข้อมูล…</p>');
        try {
            const form = await this.apiGet('/forms/' + columns.map(column => encodeURIComponent(key[column])).join('/'));
            if (requestId !== this.detailRequest) return;
            if (!form || !Array.isArray(form.DETAILS)) throw new Error('รูปแบบฟอร์มไม่ถูกต้อง');
            let html = this.renderFields([
                ...columns.map(column => [column, form[column]]),
                ['ประเภทฟอร์ม', form.FORM_TYPE], ['สถานะ', this.workflowLabel(form.FORM_STATUS)],
                ...this.jigFields(form), ['ผลรวม', form.OVERALL_RESULT]
            ]);
            html += '<h4>รายการตรวจ</h4><div style="overflow:auto"><table class="table table-bordered"><thead><tr><th>ลำดับ</th><th>จุดตรวจ</th><th>เครื่องมือ</th><th>Min</th><th>Max</th><th>ค่าที่วัด</th><th>หน่วย</th><th>ผล</th></tr></thead><tbody>';
            html += form.DETAILS.map(row => '<tr>' + ['CHECK_SEQ', 'CHECK_POINT', 'INSPECTION_TOOL', 'MIN', 'MAX', 'MEASURED_VALUE', 'UNIT', 'RESULT'].map(column => `<td>${this.escapeHtml(row[column] ?? '-')}</td>`).join('') + '</tr>').join('');
            html += '</tbody></table></div><h4>ข้อมูล NG</h4>';
            html += form.NG ? this.renderFields([
                ['รายละเอียดปัญหา', form.NG.DEFECT_DETAIL], ['วิธีแก้ไข', form.NG.ACCESS_METHOD],
                ['วันที่วางแผน', this.formatFullDate(form.NG.PLAN_DATE)], ['Location', form.NG.LOCATION]
            ]) : '<p>ไม่มีข้อมูล NG</p>';
            html += '<h4>ข้อมูลไฟล์แนบ</h4>';
            html += Array.isArray(form.FILES) && form.FILES.length ? '<ul>' + form.FILES.map(file => `<li>${this.escapeHtml(file.FILE_NAME)} (${this.escapeHtml(file.FILE_TYPE || '-')})</li>`).join('') + '</ul>' : '<p>ไม่มีไฟล์แนบ</p>';
            this.showInfo('ข้อมูลฟอร์มย้อนหลัง', html);
        } catch (error) {
            if (requestId !== this.detailRequest) return;
            this.showInfo('ข้อมูลฟอร์มย้อนหลัง', `<p class="text-danger">โหลดฟอร์มไม่สำเร็จ (${this.escapeHtml(error.message)})</p>`);
        }
    },

    escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};
