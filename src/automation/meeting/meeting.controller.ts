import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { MeetingService } from './meeting.service';

@Controller('automate/meeting')
export class MeetingController {
  constructor(private readonly meeting: MeetingService) {}

  @Post('create')
  async create(@Body() body: any[]) {
    try {
      const { browser, page } = await this.meeting.initSession(body);

      const sbutton = page.locator('button[aria-label^="start date"]');
      await sbutton.click();
      const scalendar = await sbutton.getAttribute('aria-owns');
      const stime = page.locator('input[aria-label="start time"]');
      await this.meeting.selectDate(
        page,
        scalendar,
        stime,
        body['startdate'],
        body['starttime'],
      );

      const ebutton = page.locator('button[aria-label^="end date"]');
      await ebutton.click();
      const ecalendar = await ebutton.getAttribute('aria-owns');
      const etime = page.locator('input[aria-label="end time"]');
      await this.meeting.selectDate(
        page,
        ecalendar,
        etime,
        body['enddate'],
        body['endtime'],
      );
      const rooms = await this.meeting.roomlist(page);
      const roomselect = await this.meeting.selectRoom(page, body['room']);
      await this.meeting.participants(page, body['attendees']);
      await this.meeting.messages(page, body);
      await page.getByRole('button', { name: 'Send' }).click();
      await page.waitForLoadState('networkidle');
      await this.meeting.logout(page);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Post('room')
  async findroom(@Body() body: any[]) {
    try {
      const { browser, page } = await this.meeting.initSession(body);
      //Start Date
      const sbutton = page.locator('button[aria-label^="start date"]');
      await sbutton.click();
      const scalendar = await sbutton.getAttribute('aria-owns');
      const stime = page.locator('input[aria-label="start time"]');
      await this.meeting.selectDate(
        page,
        scalendar,
        stime,
        '2025-09-20',
        '12:00 AM',
      );

      //End Date
      const ebutton = page.locator('button[aria-label^="end date"]');
      await ebutton.click();
      const ecalendar = await ebutton.getAttribute('aria-owns');
      const etime = page.locator('input[aria-label="end time"]');
      await this.meeting.selectDate(
        page,
        ecalendar,
        etime,
        '2025-09-20',
        '03:00 PM',
      );
      const rooms = this.meeting.roomlist(page);
      return rooms;
    } catch (err) {
      return false;
    }
  }
}
