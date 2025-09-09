import { Injectable, UnauthorizedException } from '@nestjs/common';
import { chromium } from 'playwright';

@Injectable()
export class MeetingService {
  async setMeeting(data) {
    const browser = await chromium.launch({ headless: true, slowMo: 100 });
    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      viewport: { width: 1366, height: 768 },
    });
    const page = await context.newPage();
    await page.goto(
      'https://amecoutlook.mitsubishielevatorasia.co.th/owa/auth/logon.aspx?',
    );
    await page.screenshot({ path: 'outlook/1-home.png', fullPage: true });

    //เข้าสู่ระบบ
    const auth = await this.login(page, data);
    if (!auth.status) {
      throw new UnauthorizedException(auth.msg);
    }

    //กดปุ่ม New event
    const newBtn = page.getByRole('button', { name: 'New' });
    await newBtn.waitFor({ state: 'visible' });
    await page.screenshot({
      path: 'outlook/3-opencalendar.png',
      fullPage: true,
    });
    await newBtn.click();
    await page.waitForSelector(
      'input[placeholder="Add a title for the event"]',
      { timeout: 10000 },
    );

    //สร้าง Event ใหม่
    await this.subject(page, data);

    return;

    await page.click('button[aria-label^="start date"]');
    const startPopupId = await page.getAttribute(
      'button[aria-label^="start date"]',
      'aria-owns',
    );
    await this.selectDateWithMonthYear(page, startPopupId, 2025, 9, 13);
    await page.fill('input[aria-label="start time"]', '09:30 AM');

    await page.click('button[aria-label^="end date"]');
    const endPopupId = await page.getAttribute(
      'button[aria-label^="end date"]',
      'aria-owns',
    );
    await this.selectDateWithMonthYear(page, endPopupId, 2025, 9, 13);
    await page.screenshot({
      path: 'outlook/4-click start date.png',
      fullPage: true,
    });

    await page.click(
      'input[aria-labelledby="MeetingCompose.LocationInputLabel"]',
    );
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: 'outlook/4.1-Room.png',
      fullPage: true,
    });
    await this.selectRoom(page, 'EP Fueangfa Room');

    const attendees = [
      'kanittha@MitsubishiElevatorAsia',
      'chalorms@MitsubishiElevatorAsia.co.th',
    ];

    for (const email of attendees) {
      const addPeopleInput = page.getByRole('textbox', { name: 'Add people' });
      await addPeopleInput.click();
      await addPeopleInput.fill(email);
      await page.waitForLoadState('networkidle');
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
      console.log(`✅ เพิ่มผู้เข้าร่วม ${email} เรียบร้อย`);
    }

    await page.screenshot({
      path: 'outlook/5-Add users.png',
      fullPage: true,
    });

    await page.getByRole('button', { name: 'Send' }).click();
    await page.waitForLoadState('networkidle');
    await this.logoutFromOutlook(page);
    await page.screenshot({
      path: 'outlook/6-Logout.png',
      fullPage: true,
    });
    await browser.close();
  }

  async login(page, data) {
    await page.fill('input[name="username"]', data.email);
    await page.fill('input[name="password"]', data.password);
    await page.click('text=Sign in');
    await page.waitForLoadState('networkidle');

    const errorDiv = page.locator('#signInErrorDiv');
    if ((await errorDiv.count()) > 0) {
      await page.screenshot({
        path: 'outlook/2-logged in error.png',
        fullPage: true,
      });

      const errorMsg = await errorDiv.innerText();
      return { status: false, msg: errorMsg };
    } else {
      await page.goto(
        'https://amecoutlook.mitsubishielevatorasia.co.th/owa/#path=/calendar',
      );
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: 'outlook/3-logged in success.png',
        fullPage: true,
      });
      return { status: true, msg: '' };
    }
  }

  async subject(page, data) {
    const bodytag = page.locator('div.allowTextSelection p');
    const subjectTag = page.locator(
      'input[placeholder="Add a title for the event"]',
    );
    await subjectTag.fill(data.subject);
  }

  async selectDateWithMonthYear(
    page,
    calendarPopupId,
    targetYear,
    targetMonth,
    targetDay,
  ) {
    await page.waitForSelector(`#${calendarPopupId}`, { state: 'visible' });
    const monthYearSelector = `#${calendarPopupId} button._dx_g`;
    let currentMonthYear = await page.locator(monthYearSelector).innerText();

    function parseMonthYear(text) {
      const [monthName, yearStr] = text.split(' ');
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const monthNum = monthNames.findIndex((m) => m === monthName) + 1;
      const yearNum = parseInt(yearStr);
      return { monthNum, yearNum };
    }

    let { monthNum: currentMonth, yearNum: currentYear } =
      parseMonthYear(currentMonthYear);

    // ดีกว่าคือ เลือกจากปุ่มที่มี icon ลูกศรซ้าย/ขวา ตาม class ที่เจอ
    // จาก HTML ปุ่มลูกศรซ้าย class "_dx_l" ปุ่มลูกศรขวา class "_dx_k"

    const nextButtonSelector = `#${calendarPopupId} button._dx_k`;
    const prevButtonSelector = `#${calendarPopupId} button._dx_l`;

    while (currentYear !== targetYear || currentMonth !== targetMonth) {
      if (
        currentYear > targetYear ||
        (currentYear === targetYear && currentMonth > targetMonth)
      ) {
        await page.click(prevButtonSelector);
      } else {
        await page.click(nextButtonSelector);
      }
      await page.waitForTimeout(500);

      currentMonthYear = await page.locator(monthYearSelector).innerText();
      ({ monthNum: currentMonth, yearNum: currentYear } =
        parseMonthYear(currentMonthYear));
    }

    const dayCell = page.locator(`#${calendarPopupId} abbr`, {
      hasText: String(targetDay),
    });
    await dayCell.first().click({ force: true });
    console.log(
      `✅ เลือกวันที่ ${targetDay} เดือน ${targetMonth} ปี ${targetYear} สำเร็จ!`,
    );
  }

  async selectRoom(page, roomName) {
    await page.getByRole('button', { name: 'Add room' }).click();
    console.log('✅ กดปุ่ม Add room แล้ว');

    await page.waitForTimeout(3000); // รอ popup โหลด

    // รอ container ห้องโหลด
    const container = page.locator('div._exadr_c.scrollContainer');
    await container.waitFor({ state: 'attached', timeout: 15000 });

    // scroll ลงล่าง เพื่อโหลดห้องให้ครบ (ถ้ามี lazy load)
    await container.evaluate((el) => (el.scrollTop = el.scrollHeight));
    await page.waitForTimeout(2000);

    // ลิสต์ชื่อห้องทั้งหมด
    const allRooms = await page.locator('span._exadr_r').allTextContents();
    console.log('📝 ห้องที่เจอทั้งหมด:', allRooms.join('|'));

    // หาโดยใช้ title attribute แทน text เผื่อตรงกว่า
    const targetRoom = page
      .locator(`span._exadr_r[title="${roomName}"]`)
      .first();

    if ((await targetRoom.count()) === 0) {
      throw new Error(`❌ ไม่พบห้อง "${roomName}"`);
    }

    await targetRoom.scrollIntoViewIfNeeded();
    await targetRoom.click();

    console.log(`✅ คลิกห้อง "${roomName}" สำเร็จ!`);
  }

  async logoutFromOutlook(page) {
    try {
      // 🔹 คลิกปุ่มโปรไฟล์
      await page.click('button[aria-label*="menu with submenu"]');
      await page.waitForTimeout(1000);

      // 🔹 คลิกปุ่ม Sign out
      const signOutButton = page.getByRole('menuitem', { name: 'Sign out' });
      await signOutButton.waitFor({ state: 'visible', timeout: 5000 });
      await signOutButton.click();

      // 🔹 รอให้ปุ่ม Sign out หายไปแทนการรอ navigation
      await signOutButton.waitFor({ state: 'detached', timeout: 5000 });

      console.log('✅ ออกจากระบบเรียบร้อยแล้ว!');
    } catch (err) {
      console.error('⚠️ ไม่สามารถออกจากระบบได้:', err.message);
    }
  }
}
