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
    fiscalYear: null,
    requestId: 0,
    loading: false,
    detailRequestId: 0,
    savingJig: false,

    async init() {
        this.bindEvents();
        $('#btn-add-jig')
            .prop('disabled', !String(JIG_CONFIG.empno || '').trim())
            .attr(
                'title',
                JIG_CONFIG.empno
                    ? 'เพิ่ม JIG'
                    : 'ไม่พบข้อมูลผู้ใช้ กรุณา login ใหม่',
            );
        this.renderFiscalYear();
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

        $('#fyear').on('change', async function () {
            JigDashboard.fiscalYear = Number($(this).val());
            JigDashboard.currentPage = 1;
            await JigDashboard.loadDashboard(JigDashboard.fiscalYear);
        });

        $('#btn-retry').on('click', () => this.loadDashboard(this.fiscalYear));
        $('#jig-detail-close').on('click', () => {
            this.detailRequestId++;
            document.getElementById('jig-detail').close();
        });
        $(document).on('click', '.btn-view-form', function () {
            JigDashboard.viewForm(JSON.parse($(this).attr('data-form')));
        });

        $('#btn-export').on('click', function () {
            JigDashboard.exportExcel();
        });

        $('#btn-add-jig').on('click', function () {
            JigDashboard.openAddJig();
        });
        $('#jig-add-form').on('submit', (event) => {
            event.preventDefault();
            this.saveNewJig();
        });
        $('.jig-add-cancel').on('click', () => {
            if (!this.savingJig) document.getElementById('jig-add').close();
        });
        document
            .getElementById('jig-add')
            .addEventListener('cancel', (event) => {
                if (this.savingJig) event.preventDefault();
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
    },

    async loadDashboard(fyear = null) {
        const requestId = ++this.requestId;
        this.loading = true;
        this.showLoading();
        $('#jig-error').prop('hidden', true);
        $('#btn-export, .jig-filter, #jig-search').prop('disabled', true);
        try {
            const result = await this.fetchApi(
                '/dashboard' +
                    (fyear ? '?fyear=' + encodeURIComponent(fyear) : ''),
            );
            if (requestId !== this.requestId) return;
            if (
                !Array.isArray(result.items) ||
                !Number.isInteger(Number(result.fyear))
            )
                throw new Error('Invalid dashboard response');
            this.data = result.items;
            this.fiscalYear = Number(result.fyear);
            this.renderFiscalYear();
            this.renderSummary(result.summary || {});
            this.renderPeriod(result.period);
            this.applyFilter();
        } catch (error) {
            if (requestId !== this.requestId) return;
            console.error('JIG Dashboard Error:', error);
            this.data = [];
            this.filteredData = [];
            $('[id^="summary-"], [id^="filter-"]').not('#summary-fy').text('—');
            $('#completed-rounds').text('—');
            $('#period-label').text('');
            $('#jig-error').prop('hidden', false);
            $('#jig-table-body').html(
                '<tr><td colspan="9" class="text-center py-4">ไม่สามารถโหลดข้อมูล Dashboard ได้ กรุณาลองใหม่</td></tr>',
            );
            this.renderPagination(0, 0, 0);
        } finally {
            if (requestId === this.requestId) {
                this.loading = false;
                $('#jig-table').attr('aria-busy', 'false');
                $('#btn-export').prop('disabled', !this.filteredData.length);
                $('.jig-filter, #jig-search').prop('disabled', false);
            }
        }
    },

    async fetchApi(path, options = {}) {
        const response = await fetch(
            JIG_CONFIG.apiUrl.replace(/\/$/, '') + '/iedoc/jig' + path,
            {
                ...options,
                headers: { Accept: 'application/json', ...options.headers },
            },
        );
        if (!response.ok) {
            const body = await response.json().catch(() => null);
            const messages = (value) =>
                Array.isArray(value)
                    ? value.flatMap(messages)
                    : typeof value === 'string'
                      ? [value]
                      : value && value.message
                        ? messages(value.message)
                        : [];
            const error = new Error(
                messages(body).join('\n') || 'HTTP ' + response.status,
            );
            error.status = response.status;
            throw error;
        }
        return response.json();
    },

    renderFiscalYear() {
        const now = this.parseDate(new Date().toISOString());
        const current =
            now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
        const selected = this.fiscalYear || current;
        const years = [];
        for (
            let year = Math.max(current + 1, selected);
            year >= Math.min(current - 5, selected);
            year--
        )
            years.push(year);
        $('#fyear')
            .html(
                years
                    .map(
                        (year) =>
                            '<option value="' +
                            year +
                            '">FY' +
                            year +
                            ' (Apr–Mar)</option>',
                    )
                    .join(''),
            )
            .val(String(selected));
        $('#summary-fy').text(String(selected).slice(-2));
    },

    renderSummary(summary) {
        const values = {
            total: summary.total,
            completed: summary.completed,
            'due-soon': summary.dueSoon,
            overdue: summary.overdue,
            new: summary.newJig,
            'in-progress': summary.inProgress,
            'no-sheet': summary.noSheet,
            '6m': this.data.filter((item) => Number(item.INSPEC_PERIOD) === 6)
                .length,
        };
        Object.entries(values).forEach(([name, value]) => {
            $('#summary-' + name + ', #filter-' + name).text(
                Number.isFinite(Number(value)) ? Number(value) : 0,
            );
        });
        $('#completed-rounds').text(Number(summary.completedRounds || 0));
    },

    applyFilter() {
        let items = [...this.data];

        switch (this.currentFilter) {
            case 'due-soon':
                items = items.filter((item) => item.DUE_STATUS === 'DUE_SOON');
                break;

            case 'new':
                items = items.filter((item) => item.IS_NEW_JIG === true);
                break;
            case 'overdue':
                items = items.filter((item) => item.DUE_STATUS === 'OVERDUE');
                break;
            case 'in-progress':
                items = items.filter(
                    (item) =>
                        item.CURRENT_FORM &&
                        ['0', '1'].includes(
                            String(item.CURRENT_FORM.FORM_STATUS).trim(),
                        ),
                );
                break;
            case 'no-sheet':
                items = items.filter(
                    (item) => Number(item.CHECKPOINT_COUNT) === 0,
                );
                break;

            case '6m':
                items = items.filter(
                    (item) => Number(item.INSPEC_PERIOD) === 6,
                );
                break;
        }

        if (this.searchText) {
            items = items.filter((item) => {
                const jigNo = String(item.JIG_NO || '').toLowerCase();
                const jigName = String(item.JIG_NAME || '').toLowerCase();
                const picName = String(item.PIC_NAME || '').toLowerCase();
                const picEmpno = String(item.PIC_EMPNO || '').toLowerCase();
                const process = String(item.PROCESS_CODE || '').toLowerCase();

                return (
                    jigNo.includes(this.searchText) ||
                    jigName.includes(this.searchText) ||
                    picName.includes(this.searchText) ||
                    picEmpno.includes(this.searchText) ||
                    process.includes(this.searchText) ||
                    [item.DWG, item.REV, item.LOCATION, item.PIC_SECTION].some(
                        (value) =>
                            String(value || '')
                                .toLowerCase()
                                .includes(this.searchText),
                    )
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
            const status =
                this.renderStatus(item.DASHBOARD_STATUS) +
                (['IN_PROGRESS', 'NO_SHEET', 'AWAITING_SYNC'].includes(
                    item.DASHBOARD_STATUS,
                ) && ['DUE_SOON', 'OVERDUE'].includes(item.DUE_STATUS)
                    ? '<br>' + this.renderStatus(item.DUE_STATUS)
                    : '');
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
                            ${item.IS_NEW_JIG ? '<span class="legend-status status-new">New</span>' : ''}
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

                    <td class="${this.getNextInspectionClass(item.DUE_STATUS)}">
                        ${nextInspection}
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
        const schedules = Array.isArray(item.SCHEDULES) ? item.SCHEDULES : [];
        return (
            schedules
                .map((schedule) => {
                    const date = this.parseDate(schedule.SCHEDULE_DATE);
                    if (!date) return '';
                    const state = {
                        COMPLETED: ['schedule-finished', 'อนุมัติครบแล้ว'],
                        IN_PROGRESS: [
                            'schedule-running',
                            'กำลังตรวจ / รออนุมัติ',
                        ],
                    }[schedule.STATUS] || ['schedule-planned', 'แผนตรวจ'];
                    return (
                        '<span class="schedule-month ' +
                        state[0] +
                        '" title="' +
                        state[1] +
                        ' — ' +
                        this.formatMonthYear(schedule.SCHEDULE_DATE) +
                        '">' +
                        this.getMonthShort(date.getMonth()) +
                        '</span>'
                    );
                })
                .join('') || '<span class="text-muted">—</span>'
        );
    },

    renderStatus(status) {
        const states = {
            OVERDUE: ['status-overdue', 'เกินกำหนด'],
            DUE_SOON: ['status-due-soon', 'ใกล้กำหนด'],
            PLANNED: ['status-planned', 'ตามแผน'],
            NO_SHEET: ['status-overdue', 'ไม่มี Check Sheet'],
            IN_PROGRESS: ['status-running', 'กำลังตรวจ'],
            AWAITING_SYNC: ['status-due-soon', 'รออัปเดตรอบ'],
            UNSCHEDULED: ['status-muted', 'ยังไม่กำหนดรอบ'],
            DRAFT: ['status-muted', 'ฉบับร่าง'],
            PENDING: ['status-running', 'รออนุมัติลงทะเบียน'],
            ACTIVE: ['status-completed', 'ใช้งาน'],
            INACTIVE: ['status-muted', 'หยุดใช้งาน'],
            PENDING_DELETE: ['status-due-soon', 'รออนุมัติลบ'],
            DELETED: ['status-muted', 'ลบแล้ว'],
            TRANSFERRED: ['status-muted', 'โอนย้ายแล้ว'],
        };
        const state = states[status] || [
            'status-muted',
            status || 'ไม่ระบุสถานะ',
        ];
        return (
            '<span class="jig-status ' +
            state[0] +
            '">' +
            this.escapeHtml(state[1]) +
            '</span>'
        );
    },

    renderAction(item) {
        if (item.CURRENT_FORM)
            return this.formButton(item.CURRENT_FORM, 'ดูฟอร์ม');
        const jig = this.escapeHtml(item.JIG_NO);
        const inspectable =
            item.JIG_STATUS === 'ACTIVE' &&
            Number(item.CHECKPOINT_COUNT) > 0 &&
            this.parseDate(item.NEXT_INSPEC_DATE);
        const inspect = inspectable
            ? '<button type="button" class="btn btn-sm btn-inspect" data-jig="' +
              jig +
              '" ' +
              (JIG_CONFIG.inspectionUrl
                  ? ''
                  : 'disabled title="ยังไม่ได้เชื่อมหน้าฟอร์มตรวจสอบ"') +
              '>ตรวจสอบ</button> '
            : '';
        return (
            inspect +
            '<button type="button" class="btn btn-sm btn-view-jig" data-jig="' +
            jig +
            '">รายละเอียด</button>'
        );
    },

    formButton(form, label) {
        return (
            '<button type="button" class="btn btn-sm btn-view-form" data-form="' +
            this.escapeHtml(JSON.stringify(this.formKey(form))) +
            '">' +
            label +
            '</button>'
        );
    },

    formKey(form) {
        return Object.fromEntries(
            ['NFRMNO', 'VORGNO', 'CYEAR', 'CYEAR2', 'NRUNNO'].map((key) => [
                key,
                form[key],
            ]),
        );
    },

    renderPagination(start, end, total) {
        const $pagination = $('#pagination');

        $('#pagination-info').text(
            total
                ? `แสดง ${start}-${end} จาก ${total} รายการ`
                : 'แสดง 0-0 จาก 0 รายการ',
        );

        $pagination.empty();

        const totalPages = Math.ceil(total / this.pageSize);

        if (totalPages <= 1) return;

        const prevDisabled = this.currentPage === 1 ? 'disabled' : '';

        $pagination.append(`
            <button type="button"
                    class="page-btn page-arrow"
                    data-page="${this.currentPage - 1}"
                    ${prevDisabled}>
                ‹
            </button>
        `);

        const pages = this.getPaginationPages(totalPages);

        pages.forEach((page) => {
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

        const nextDisabled = this.currentPage === totalPages ? 'disabled' : '';

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
            return Array.from({ length: totalPages }, (_, index) => index + 1);
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
                totalPages,
            ];
        }

        return [
            1,
            '...',
            this.currentPage - 1,
            this.currentPage,
            this.currentPage + 1,
            '...',
            totalPages,
        ];
    },

    renderPeriod(period) {
        if (!period || !period.from || !period.to) {
            $('#period-label').text('');
            return;
        }

        const from = this.parseDate(period.from);
        const to = this.parseDate(period.to);

        if (!from || !to) return;

        const fyShort = String(this.fiscalYear).slice(-2);

        $('#period-label').text(
            `FY${fyShort}: ${this.getMonthShort(from.getMonth())} ${from.getFullYear()} – ` +
                `${this.getMonthShort(to.getMonth())} ${to.getFullYear()}`,
        );
    },

    getControllerName(item) {
        const name = String(item.PIC_NAME || '').trim();
        const process = String(item.PIC_SECTION || '').trim();

        if (name && process) return `${name}/${process}`;
        if (name) return name;
        if (item.PIC_EMPNO) return item.PIC_EMPNO;

        return '-';
    },

    getInspectionPeriod(item) {
        const period = Number(item.INSPEC_PERIOD);

        if (!period) return '-';

        if (period === 12) return '1Y';

        return `${period}M`;
    },

    getNextInspectionClass(status) {
        if (status === 'OVERDUE') return 'next-overdue';
        if (status === 'DUE_SOON') return 'next-due-soon';

        return '';
    },

    formatMonthYear(value) {
        const date = this.parseDate(value);

        if (!date) return '-';

        return `${this.getMonthShort(date.getMonth())} ${date.getFullYear()}`;
    },

    parseDate(value) {
        if (!value) return null;
        const text = String(value);
        const calendar = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
        if (calendar) {
            const date = new Date(
                Number(calendar[1]),
                Number(calendar[2]) - 1,
                Number(calendar[3]),
            );
            return date.getFullYear() === Number(calendar[1]) &&
                date.getMonth() === Number(calendar[2]) - 1 &&
                date.getDate() === Number(calendar[3])
                ? date
                : null;
        }
        const date = new Date(value);
        if (!Number.isFinite(date.getTime())) return null;
        // Oracle dates arrive as ISO instants. Render their Bangkok calendar day in every browser timezone.
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).formatToParts(date);
        const part = (type) => Number(parts.find((p) => p.type === type).value);
        return new Date(part('year'), part('month') - 1, part('day'));
    },

    getMonthShort(month) {
        return [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
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
            ],
        ];

        this.filteredData.forEach((item, index) => {
            rows.push([
                index + 1,
                item.JIG_NO || '',
                item.JIG_NAME || '',
                this.getControllerName(item),
                this.getInspectionPeriod(item),
                this.formatMonthYear(item.NEXT_INSPEC_DATE),
                item.DASHBOARD_STATUS || '',
            ]);
        });

        const csv = rows
            .map((row) => row.map((value) => this.csvCell(value)).join(','))
            .join('\r\n');

        const blob = new Blob(['\ufeff' + csv], {
            type: 'text/csv;charset=utf-8;',
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `JIG_Dashboard_FY${this.fiscalYear}.csv`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    },

    openAddJig() {
        if (!String(JIG_CONFIG.empno || '').trim() || this.savingJig) return;
        document.getElementById('jig-add-form').reset();
        $('#jig-inputer').val(JIG_CONFIG.empno);
        $('#jig-add-error, #jig-success').prop('hidden', true);
        document.getElementById('jig-add').showModal();
        $('#jig-add-form [name="JIG_NO"]').trigger('focus');
    },

    async saveNewJig() {
        if (this.savingJig) return;
        const form = document.getElementById('jig-add-form');
        if (!form.reportValidity()) return;
        const empno = String(JIG_CONFIG.empno || '').trim();
        if (!empno || empno.length > 10) {
            $('#jig-add-error')
                .text('ไม่พบรหัสผู้ใช้ที่ถูกต้อง กรุณา login ใหม่')
                .prop('hidden', false);
            return;
        }
        const values = new FormData(form);
        const body = { CREATE_BY: empno };
        for (const [name, value] of values) {
            const text = String(value).trim();
            if (!text) continue;
            body[name] = ['INSPEC_PERIOD', 'JIG_QTY', 'PRICE'].includes(name)
                ? Number(text)
                : text;
        }
        if (!body.JIG_NO || !body.JIG_NAME) {
            $('#jig-add-error')
                .text('กรุณาระบุรหัสและชื่อ JIG')
                .prop('hidden', false);
            return;
        }
        if (body.NEXT_INSPEC_DATE) body.NEXT_INSPEC_DATE += '-01';
        this.savingJig = true;
        $('#jig-add-error').prop('hidden', true);
        $('#jig-add-fields, #jig-add-submit, .jig-add-cancel').prop(
            'disabled',
            true,
        );
        $('#jig-add-submit').text('กำลังบันทึก…');
        try {
            await this.fetchApi('', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            document.getElementById('jig-add').close();
            $('#jig-success')
                .text('บันทึก ' + body.JIG_NO + ' เป็นฉบับร่างแล้ว')
                .prop('hidden', false);
            this.currentFilter = 'all';
            this.searchText = body.JIG_NO.toLowerCase();
            this.currentPage = 1;
            $('.jig-filter')
                .removeClass('active')
                .filter('[data-filter="all"]')
                .addClass('active');
            $('#jig-search').val(body.JIG_NO);
            await this.loadDashboard(this.fiscalYear);
        } catch (error) {
            const message =
                error.status === 409
                    ? 'รหัส JIG นี้มีอยู่แล้ว กรุณาตรวจสอบรหัสอีกครั้ง'
                    : error.status === 400
                      ? error.message
                      : 'บันทึกไม่สำเร็จหรือยังยืนยันผลไม่ได้ กรุณาตรวจสอบ dashboard ก่อนลองใหม่';
            $('#jig-add-error').text(message).prop('hidden', false);
        } finally {
            this.savingJig = false;
            $('#jig-add-fields, #jig-add-submit, .jig-add-cancel').prop(
                'disabled',
                false,
            );
            $('#jig-add-submit').text('บันทึก JIG');
        }
    },

    openInspection(jigNo) {
        const jig = this.data.find(
            (item) => String(item.JIG_NO) === String(jigNo),
        );
        if (
            !jig ||
            !JIG_CONFIG.inspectionUrl ||
            jig.JIG_STATUS !== 'ACTIVE' ||
            !jig.NEXT_INSPEC_DATE ||
            Number(jig.CHECKPOINT_COUNT) < 1
        )
            return;
        if (jig.CURRENT_FORM)
            return this.viewForm(this.formKey(jig.CURRENT_FORM));
        const due = this.parseDate(jig.NEXT_INSPEC_DATE);
        if (!due) return;
        const schedule =
            due.getFullYear() +
            '-' +
            String(due.getMonth() + 1).padStart(2, '0') +
            '-01';
        this.navigate(JIG_CONFIG.inspectionUrl, {
            jigNo,
            SCHEDULE_DATE: schedule,
            FORM_TYPE: 'INSPECTION',
            empno: JIG_CONFIG.empno,
        });
    },

    navigate(path, params) {
        const url = new URL(path, JIG_CONFIG.baseUrl);
        if (!['http:', 'https:'].includes(url.protocol)) return;
        Object.entries(params).forEach(([key, value]) =>
            url.searchParams.set(key, value ?? ''),
        );
        window.location.assign(url.href);
    },

    openDetail(title) {
        const dialog = document.getElementById('jig-detail');
        $('#jig-detail-title').text(title);
        $('#jig-detail-body').text('กำลังโหลด…');
        if (!dialog.open) dialog.showModal();
    },

    detailTable(headers, rows) {
        const esc = (value) => this.escapeHtml(value ?? '—');
        return (
            '<div class="jig-detail-table"><table class="table"><thead><tr>' +
            headers.map((value) => '<th>' + esc(value) + '</th>').join('') +
            '</tr></thead><tbody>' +
            (rows.length
                ? rows
                      .map(
                          (row) =>
                              '<tr>' +
                              row
                                  .map((value) => '<td>' + esc(value) + '</td>')
                                  .join('') +
                              '</tr>',
                      )
                      .join('')
                : '<tr><td colspan="' +
                  headers.length +
                  '">ไม่มีข้อมูล</td></tr>') +
            '</tbody></table></div>'
        );
    },

    async viewForm(key) {
        if (JIG_CONFIG.formUrl)
            return this.navigate(JIG_CONFIG.formUrl, {
                no: key.NFRMNO,
                orgNo: key.VORGNO,
                y: key.CYEAR,
                y2: key.CYEAR2,
                runNo: key.NRUNNO,
                empno: JIG_CONFIG.empno,
            });
        const requestId = ++this.detailRequestId;
        this.openDetail('รายละเอียดฟอร์ม');
        try {
            const form = await this.fetchApi(
                '/forms/' +
                    Object.values(this.formKey(key))
                        .map(encodeURIComponent)
                        .join('/'),
            );
            if (requestId !== this.detailRequestId) return;
            let html = this.detailTable(
                ['ข้อมูล', 'ค่า'],
                [
                    ['JIG', form.JIG_NO],
                    ['ประเภท', form.FORM_TYPE],
                    ['กำหนดตรวจ', this.formatMonthYear(form.SCHEDULE_DATE)],
                    ['วันที่ตรวจจริง', this.formatDate(form.CHECK_DATE)],
                    ['ผู้ตรวจ', form.INSPECTOR_EMPNO],
                    ['ผลรวม', form.OVERALL_RESULT],
                    ['สถานะฟอร์ม', this.formStatusLabel(form.FORM_STATUS)],
                ],
            );
            html +=
                '<h4>ผลตรวจ</h4>' +
                this.detailTable(
                    [
                        'ข้อ',
                        'จุดตรวจ',
                        'เครื่องมือ',
                        'Min',
                        'Max',
                        'ค่าที่วัด',
                        'หน่วย',
                        'ผล',
                    ],
                    (form.DETAILS || []).map((d) => [
                        d.CHECK_SEQ,
                        d.CHECK_POINT,
                        d.INSPECTION_TOOL,
                        d.MIN,
                        d.MAX,
                        d.MEASURED_VALUE,
                        d.UNIT,
                        d.RESULT,
                    ]),
                );
            if (form.NG)
                html +=
                    '<h4>การแก้ไข NG</h4>' +
                    this.detailTable(
                        ['ข้อมูล', 'ค่า'],
                        [
                            ['ข้อบกพร่อง', form.NG.DEFECT_DETAIL],
                            ['วิธีแก้ไข', form.NG.ACCESS_METHOD],
                            [
                                'แผนดำเนินการ',
                                this.formatDate(form.NG.PLAN_DATE),
                            ],
                            ['สถานที่', form.NG.LOCATION],
                        ],
                    );
            html +=
                '<h4>ไฟล์แนบ</h4>' +
                this.detailTable(
                    ['ชื่อไฟล์', 'ชนิด', 'ขนาด (bytes)'],
                    (form.FILES || []).map((file) => [
                        file.FILE_NAME,
                        file.FILE_TYPE,
                        file.FILE_SIZE,
                    ]),
                );
            $('#jig-detail-body').html(html);
        } catch (error) {
            if (requestId === this.detailRequestId)
                $('#jig-detail-body').text(
                    'ไม่สามารถโหลดรายละเอียดฟอร์มได้ กรุณาปิดแล้วลองใหม่',
                );
        }
    },

    formStatusLabel(status) {
        return (
            {
                0: 'เตรียมฟอร์ม',
                1: 'กำลังดำเนินการ',
                2: 'อนุมัติครบแล้ว',
                3: 'ไม่อนุมัติ',
            }[String(status).trim()] || 'ไม่ระบุสถานะ'
        );
    },

    formatDate(value) {
        const date = this.parseDate(value);
        return date
            ? String(date.getDate()).padStart(2, '0') +
                  '/' +
                  String(date.getMonth() + 1).padStart(2, '0') +
                  '/' +
                  date.getFullYear()
            : '—';
    },

    csvCell(value) {
        let text = String(value ?? '');
        if (/^[\s]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text))
            text = "'" + text;
        return '"' + text.replace(/"/g, '""') + '"';
    },

    async viewJig(jigNo) {
        const requestId = ++this.detailRequestId;
        this.openDetail('JIG ' + jigNo);
        try {
            const path = '/' + encodeURIComponent(jigNo);
            const [jig, points, forms] = await Promise.all([
                this.fetchApi(path),
                this.fetchApi(path + '/checkpoints'),
                this.fetchApi(path + '/forms'),
            ]);
            if (requestId !== this.detailRequestId) return;
            let html = this.detailTable(
                ['ข้อมูล', 'ค่า'],
                [
                    ['ชื่อ', jig.JIG_NAME],
                    ['Drawing', jig.DWG],
                    ['Revision', jig.REV],
                    ['สถานที่', jig.LOCATION],
                    ['ผู้รับผิดชอบ', jig.PIC_EMPNO],
                    ['รอบตรวจ', this.getInspectionPeriod(jig)],
                    ['กำหนดถัดไป', this.formatMonthYear(jig.NEXT_INSPEC_DATE)],
                    ['สถานะทะเบียน', jig.JIG_STATUS],
                    ['หมายเหตุ', jig.REMARK],
                ],
            );
            html +=
                '<h4>Check Sheet</h4>' +
                this.detailTable(
                    ['ข้อ', 'จุดตรวจ', 'เครื่องมือ', 'Min', 'Max', 'หน่วย'],
                    points.map((p) => [
                        p.CHECK_SEQ,
                        p.CHECK_POINT,
                        p.INSPECTION_TOOL,
                        p.MIN,
                        p.MAX,
                        p.UNIT,
                    ]),
                );
            html +=
                '<h4>ประวัติฟอร์ม</h4><div class="jig-form-history">' +
                (forms
                    .map(
                        (f) =>
                            '<div>' +
                            this.escapeHtml(
                                f.FORM_TYPE +
                                    ' · ' +
                                    this.formatMonthYear(f.SCHEDULE_DATE) +
                                    ' · ' +
                                    this.formStatusLabel(f.FORM_STATUS),
                            ) +
                            ' ' +
                            this.formButton(f, 'ดูฟอร์ม') +
                            '</div>',
                    )
                    .join('') || 'ไม่มีฟอร์ม') +
                '</div>';
            $('#jig-detail-body').html(html);
        } catch (error) {
            if (requestId === this.detailRequestId)
                $('#jig-detail-body').text(
                    'ไม่สามารถโหลดรายละเอียด JIG ได้ กรุณาปิดแล้วลองใหม่',
                );
        }
    },

    escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },
};
