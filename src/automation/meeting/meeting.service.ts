import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { chromium } from 'playwright';

@Injectable()
export class MeetingService {
  async initSession(data) {
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

    //เข้าสู่ระบบ
    const auth = await this.login(page, data);
    if (!auth.status) {
      throw new UnauthorizedException(auth.msg);
    }

    //กดปุ่ม New event
    const newBtn = page.getByRole('button', { name: 'New' });
    await newBtn.waitFor({ state: 'visible' });
    await newBtn.click();
    await page.waitForSelector(
      'input[placeholder="Add a title for the event"]',
      { timeout: 10000 },
    );
    await this.snap(page, `new-event.png`);
    return { browser, page };
  }

  async login(page, data) {
    await page.fill('input[name="username"]', data.email);
    await page.fill('input[name="password"]', data.password);
    await page.click('text=Sign in');
    await page.waitForLoadState('networkidle');

    const errorDiv = page.locator('#signInErrorDiv');
    if ((await errorDiv.count()) > 0) {
      await this.snap(page, 'logged in error.png');
      const errorMsg = await errorDiv.innerText();
      return { status: false, msg: errorMsg };
    } else {
      await page.goto(
        'https://amecoutlook.mitsubishielevatorasia.co.th/owa/#path=/calendar',
      );
      await page.waitForLoadState('networkidle');
      await this.snap(page, 'logged in success.png');
      return { status: true, msg: '' };
    }
  }

  async logout(page) {
    try {
      await page.click('button[aria-label*="menu with submenu"]');
      await page.waitForTimeout(1000);
      // 🔹 คลิกปุ่ม Sign out
      const signOutButton = page.getByRole('menuitem', { name: 'Sign out' });
      await signOutButton.waitFor({ state: 'visible', timeout: 5000 });
      await signOutButton.click();
      // 🔹 รอให้ปุ่ม Sign out หายไปแทนการรอ navigation
      await signOutButton.waitFor({ state: 'detached', timeout: 5000 });
      await this.snap(page, `signout.png`);
    } catch (err) {
      console.error('⚠️ ไม่สามารถออกจากระบบได้:', err.message);
    }
  }

  async selectDate(page, elDate, elTime, date, time) {
    try {
      const [cyear, cmonth, cday] = date.split('-');
      const targetYear = parseInt(cyear);
      const targetMonth = parseInt(cmonth);
      const targetDay = parseInt(cday);

      await page.waitForSelector(`#${elDate}`, { state: 'visible' });
      const monthYearSelector = `#${elDate} button._dx_g`;
      let currentMonthYear = await page.locator(monthYearSelector).innerText();
      let { monthNum: currentMonth, yearNum: currentYear } =
        await this.parseMonthYear(currentMonthYear);

      const nextButtonSelector = `#${elDate} button._dx_k`;
      const prevButtonSelector = `#${elDate} button._dx_l`;

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
          await this.parseMonthYear(currentMonthYear));
      }

      const dayCell = page.locator(`#${elDate} abbr`, {
        hasText: String(targetDay),
      });
      await dayCell.first().click({ force: true });
      await elTime.fill(time);
      await this.snap(page, `select-date-${Math.random()}.png`);
      return;
    } catch (err) {
      return err;
    }
  }

  async parseMonthYear(text) {
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

  async roomlist(page) {
    await page.click(
      'input[aria-labelledby="MeetingCompose.LocationInputLabel"]',
    );
    await page.getByRole('button', { name: 'Add room' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    const container = page.locator('div._exadr_c.scrollContainer');

    await container.waitFor({ state: 'attached', timeout: 15000 });
    const allRooms = await page.locator('span._exadr_r').allTextContents();
    await this.snap(page, `select-room-list.png`);
    return allRooms;
  }

  async selectRoom(page, roomName) {
    try {
      const targetRoom = page
        .locator(`span._exadr_r[title="${roomName}"]`)
        .first();
      if ((await targetRoom.count()) === 0) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      await targetRoom.scrollIntoViewIfNeeded();
      await targetRoom.click();
      await this.snap(page, `select-room.png`);
    } catch (error) {
      await this.snap(page, `select-room-error.png`);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async participants(page, attendees) {
    for (const email of attendees) {
      const addPeopleInput = page.getByRole('textbox', { name: 'Add people' });
      await addPeopleInput.click();
      await addPeopleInput.fill(email);
      await page.waitForLoadState('networkidle');
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
    }
    await this.snap(page, `add-email.png`);
  }

  async messages(page, data) {
    try{
        const bodytag = page.locator('div.allowTextSelection p');
        const subjectTag = page.locator(
            'input[placeholder="Add a title for the event"]',
        );
        await subjectTag.fill(data.subject);
        
        await bodytag.evaluate((el, message) => {
            el.innerHTML = message;
        }, data.message);
        await this.snap(page, `message-email.png`);
    }catch(err){
        console.log(err);
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async snap(page, name) {
    const img = process.env.AUTOMATESNAP || '0';
    if (img == '1') {
      await page.screenshot({
        path: `public/outlook/${name}.png`,
        fullPage: true,
      });
    }
  }
}
