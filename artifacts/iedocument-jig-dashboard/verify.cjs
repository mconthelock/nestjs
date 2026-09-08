const fs = require('fs');
const assert = require('assert/strict');
const { chromium } = require('playwright');
const root = __dirname;
const key = { NFRMNO: 1, VORGNO: '000001', CYEAR: '26', CYEAR2: '2026', NRUNNO: 1 };
const view = fs.readFileSync(root + '/application/views/jig/dashboard.blade.php', 'utf8');
const section = name => view.match(new RegExp("@section\\('" + name + "'\\)([\\s\\S]*?)@endsection"))[1];
const content = section('content').replaceAll('{{ $empno }}', 'J0144').replaceAll('{{ base_url() }}', 'http://example.test/iedocument/');
const config = section('scripts').match(/<script>([\s\S]*?)<\/script>/)[1];
const items = Array.from({ length: 13 }, (_, i) => ({
    JIG_NO: 'J-' + String(i + 1).padStart(3, '0'), JIG_NAME: 'Assembly Jig ' + (i + 1),
    DWG: 'DWG-' + i, REV: 'A', LOCATION: 'Factory', PIC_NAME: 'Siam', PIC_SECTION: 'IPM',
    PIC_EMPNO: 'J0144', INSPEC_PERIOD: 6, CHECKPOINT_COUNT: 2, JIG_STATUS: 'ACTIVE',
    NEXT_INSPEC_DATE: '2026-09-30T17:00:00.000Z', DUE_STATUS: 'DUE_SOON', DASHBOARD_STATUS: 'DUE_SOON',
    IS_NEW_JIG: i < 2, CURRENT_FORM: null,
    SCHEDULES: [{ SCHEDULE_DATE: '2026-04-01', STATUS: 'COMPLETED', FORMS: [] }, { SCHEDULE_DATE: '2026-10-01', STATUS: 'PLANNED', FORMS: [] }],
}));
items[0].DASHBOARD_STATUS = 'IN_PROGRESS';
items[0].CURRENT_FORM = { ...key, FORM_STATUS: '1' };
items[1].JIG_NAME = '=SUM(1,2)';
items[2].DASHBOARD_STATUS = 'OVERDUE'; items[2].DUE_STATUS = 'OVERDUE';
items[3].JIG_STATUS = 'DRAFT'; items[3].NEXT_INSPEC_DATE = null; items[3].DUE_STATUS = null; items[3].DASHBOARD_STATUS = 'DRAFT'; items[3].CHECKPOINT_COUNT = 0; items[3].SCHEDULES = [];
const payload = { fyear: 2026, period: { from: '2026-03-31T17:00:00.000Z', to: '2027-03-30T17:00:00.000Z' },
    summary: { total: 13, completed: 1, completedRounds: 1, newJig: 2, dueSoon: 11, overdue: 1, inProgress: 1, noSheet: 1 }, items };

(async () => {
    const browser = await chromium.launch({ headless: true });
    try {
        // Deliberately use a non-Thai timezone to catch month/day shifts from ISO dates.
        const context = await browser.newContext({ timezoneId: 'America/Los_Angeles', viewport: { width: 1500, height: 1050 }, acceptDownloads: true });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        let fail = false;
        let conflict = true;
        const creates = [];
        await page.route(/\/iedoc\/jig(?:\/|\?|$)/, async route => {
            const url = new URL(route.request().url());
            let data;
            if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
            if (route.request().method() === 'POST') {
                creates.push(route.request().postDataJSON());
                await new Promise(resolve => setTimeout(resolve, 150));
                if (conflict) return route.fulfill({ status: 409, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ message: 'JIG_NO already exists' }) });
                const created = { ...creates.at(-1), JIG_STATUS: 'DRAFT', DASHBOARD_STATUS: 'DRAFT', DUE_STATUS: null, CHECKPOINT_COUNT: 0, IS_NEW_JIG: true, SCHEDULES: [], CURRENT_FORM: null };
                items.push(created);
                return route.fulfill({ contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(created) });
            }
            if (url.pathname.endsWith('/dashboard')) {
                if (fail) return route.fulfill({ status: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: '{}' });
                const fy = Number(url.searchParams.get('fyear') || 2026);
                if (fy === 2025) await new Promise(resolve => setTimeout(resolve, 150));
                data = { ...payload, fyear: fy, summary: { ...payload.summary, total: items.length } };
            } else if (url.pathname.includes('/forms/')) data = { ...key, JIG_NO: 'J-001', FORM_TYPE: 'INSPECTION', FORM_STATUS: '1', SCHEDULE_DATE: '2026-10-01', CHECK_DATE: '2026-10-02', INSPECTOR_EMPNO: 'J0144', DETAILS: [{ CHECK_SEQ: 1, CHECK_POINT: '<img src=x onerror=alert(1)>', MIN: 1, MAX: 2, MEASURED_VALUE: 1.5, RESULT: 'OK' }], FILES: [] };
            else if (url.pathname.endsWith('/checkpoints')) data = [{ CHECK_SEQ: 1, CHECK_POINT: 'Diameter', MIN: 1, MAX: 2, UNIT: 'mm' }];
            else if (url.pathname.endsWith('/forms')) data = [{ ...key, FORM_TYPE: 'INSPECTION', FORM_STATUS: '1', SCHEDULE_DATE: '2026-10-01' }];
            else data = items.find(item => url.pathname.endsWith(item.JIG_NO));
            await route.fulfill({ contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(data) });
        });
        await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body>' + content + section('styles') + '</body></html>');
        const bootstrap = 'D:/for_dev/src/form/node_modules/bootstrap/dist/css/bootstrap.min.css';
        if (fs.existsSync(bootstrap)) await page.addStyleTag({ path: bootstrap });
        await page.addScriptTag({ path: 'D:/for_dev/src/form/node_modules/jquery/dist/jquery.min.js' });
        await page.addScriptTag({ content: config });
        await page.addScriptTag({ path: root + '/assets/scripts/jig/dashboard.js' });
        await page.waitForFunction(() => !JigDashboard.loading && JigDashboard.data.length === 13);
        assert.equal(await page.locator('#summary-new').textContent(), '2');
        assert.equal(await page.locator('#jig-table-body tr').count(), 10);
        assert.equal(await page.locator('#summary-fy').textContent(), '26');
        assert.match(await page.locator('#period-label').textContent(), /Apr 2026.*Mar 2027/);
        assert.equal(await page.evaluate(() => JigDashboard.formatMonthYear('2026-09-30T17:00:00.000Z')), 'Oct 2026');
        assert.equal(await page.evaluate(() => JigDashboard.formatMonthYear('2026-10-01')), 'Oct 2026');
        assert.equal(await page.locator('#jig-table-body tr').first().locator('.schedule-finished').textContent(), 'Apr');
        assert.equal(await page.locator('#jig-table-body tr').first().locator('.schedule-planned').textContent(), 'Oct');
        assert.equal(await page.locator('#btn-add-jig').isDisabled(), false);
        await page.locator('[data-filter="new"]').click();
        assert.equal(await page.locator('#jig-table-body tr').count(), 2);
        await page.locator('[data-filter="due-soon"]').click();
        assert.match(await page.locator('#jig-table-body tr').first().textContent(), /กำลังตรวจ/);
        await page.locator('[data-filter="overdue"]').click();
        assert.equal(await page.locator('#jig-table-body tr').count(), 1);
        await page.locator('[data-filter="all"]').click();
        await page.locator('.page-btn[data-page="2"]').first().click();
        assert.equal(await page.locator('#jig-table-body tr').count(), 3);
        await page.locator('#jig-search').fill('DWG-12');
        assert.equal(await page.locator('#jig-table-body tr').count(), 1);
        await page.locator('#jig-search').fill('');
        await page.locator('#jig-table-body .btn-view-form').first().click();
        await page.waitForFunction(() => document.querySelector('#jig-detail-body').textContent.includes('Diameter') || document.querySelector('#jig-detail-body').textContent.includes('<img'));
        assert.equal(await page.locator('#jig-detail-body img').count(), 0);
        await page.locator('#jig-detail-close').click();
        await page.locator('#jig-table-body .btn-view-jig').first().click();
        await page.waitForFunction(() => document.querySelector('#jig-detail-body').textContent.includes('ประวัติฟอร์ม'));
        assert.match(await page.locator('#jig-detail-body').textContent(), /DWG-0/);
        await page.locator('#jig-detail-close').click();
        const downloadWait = page.waitForEvent('download');
        await page.locator('#btn-export').click();
        const download = await downloadWait;
        const csv = fs.readFileSync(await download.path(), 'utf8');
        assert.match(csv, /'=SUM\(1,2\)/);
        await page.evaluate(async () => { await Promise.all([JigDashboard.loadDashboard(2025), JigDashboard.loadDashboard(2026)]); });
        assert.equal(await page.locator('#fyear').inputValue(), '2026');
        fail = true;
        await page.evaluate(() => JigDashboard.loadDashboard(2026));
        assert.equal(await page.locator('#jig-error').isVisible(), true);
        assert.equal(await page.locator('#summary-total').textContent(), '—');
        assert.equal(await page.locator('#btn-export').isDisabled(), true);
        fail = false;
        await page.locator('#btn-retry').click();
        await page.waitForFunction(() => !JigDashboard.loading && JigDashboard.data.length === 13);
        await page.locator('#btn-add-jig').click();
        assert.equal(await page.locator('#jig-inputer').inputValue(), 'J0144');
        assert.equal(await page.locator('#jig-inputer').getAttribute('readonly'), '');
        await page.locator('#jig-add-form [name="JIG_NO"]').fill('J-NEW');
        await page.locator('#jig-add-form [name="JIG_NAME"]').fill('New jig');
        await page.locator('#jig-add-form [name="INSPEC_PERIOD"]').selectOption('6');
        await page.locator('#jig-add-form [name="NEXT_INSPEC_DATE"]').fill('2026-02');
        await page.locator('#jig-add-form [name="DWG"]').fill('DWG-NEW');
        await page.locator('#jig-add-form [name="JIG_QTY"]').fill('2');
        await page.locator('#jig-inputer').evaluate(input => { input.value = 'OTHER'; });
        await page.locator('#jig-add-submit').click();
        await page.evaluate(() => JigDashboard.saveNewJig());
        await page.waitForFunction(() => !JigDashboard.savingJig);
        assert.equal(creates.length, 1, 'Double submission must be ignored');
        assert.equal(creates[0].CREATE_BY, 'J0144', 'Use the login context, not the display field');
        assert.equal(creates[0].NEXT_INSPEC_DATE, '2026-02-01');
        assert.equal(creates[0].INSPEC_PERIOD, 6);
        assert.equal(creates[0].JIG_QTY, 2);
        assert.equal(await page.locator('#jig-add').evaluate(dialog => dialog.open), true);
        assert.match(await page.locator('#jig-add-error').textContent(), /มีอยู่แล้ว/);
        assert.equal(await page.locator('#jig-add-form [name="JIG_NAME"]').inputValue(), 'New jig');
        await page.locator('#jig-inputer').evaluate(input => { input.value = 'J0144'; });
        await page.screenshot({ path: root + '/add-jig-modal-preview.png', fullPage: true });
        conflict = false;
        await page.locator('#jig-add-submit').click();
        await page.waitForFunction(() => !JigDashboard.savingJig && JigDashboard.data.length === 14);
        assert.equal(await page.locator('#jig-add').evaluate(dialog => dialog.open), false);
        assert.equal(await page.locator('#jig-table-body tr').count(), 1);
        assert.match(await page.locator('#jig-table-body').textContent(), /J-NEW/);
        assert.equal(await page.locator('#jig-success').isVisible(), true);
        await page.locator('#jig-search').fill('');
        assert.deepEqual(errors, []);
        await page.screenshot({ path: root + '/dashboard-preview.png', fullPage: true });
        console.log('PASS: render, FY, 6M schedules, Bangkok dates, filters, pagination, search, read-only details, HTML escaping, CSV escaping, request races, error/retry, Add modal, login CREATE_BY, month normalization, duplicate submit, conflict/retry and refresh; no browser errors.');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
