import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, Between, DataSource, EntityManager, In } from 'typeorm';
import { Ameccalendar } from './entities/ameccalendar.entity';
import { AmeccalendarActivity } from 'src/common/Entities/datacenter/table/AMECCALENDAR_ACTIVITY.entity';
import { AmeccalendarRepository } from './ameccalendar.repository';
import { GetProdDto } from './dto/GetProd.dto';
import { UpdateCalendarDayDto } from './dto/update-calendar-day.dto';
import { BulkUpdateCalendarDto } from './dto/bulk-update-calendar.dto';
import { CreateCalendarActivityDto } from './dto/create-calendar-activity.dto';
import { UpdateCalendarActivityDto } from './dto/update-calendar-activity.dto';

export interface AmecCalendar {
    WORKID: number; // Format: YYYYMMDD (e.g., 20260401)
    WORKYEAR: number; // e.g., 2026
    WORKMONTH: number; // e.g., 4
    DAYOFF: number; // 0 = Working Day, 1 = Day Off
}

export interface ScheduleOutput {
    workId: number;
    schdNumber: number; // Format: YYYYMMno (e.g., 2026011)
    schdMfg: string; // Format: YYYYMMcode (e.g., 202601X)
    subGroup: string; // P1, P2, P3, P4

    // Tracing back the production steps
    packingDate: number;
    inspectionDate: number;
    assyDate: number;
    paintDate: number;
    subAssyStartDate: number;
    subAssyFinishDate: number;
    feeder2StartDate: number;
    feeder2FinishDate: number;
    feeder1StartDate: number;
    feeder1FinishDate: number;
    ncProgramDate: number;
}

const SCHEDULE_GROUPS = [
    { no: 1, code: 'X' },
    { no: 2, code: 'A' },
    { no: 3, code: 'Y' },
    { no: 4, code: 'B' },
    { no: 5, code: 'Z' },
    { no: 6, code: 'C' },
];

@Injectable()
export class AmeccalendarService {
    constructor(
        @InjectRepository(Ameccalendar, 'datacenterConnection')
        private readonly calendar: Repository<Ameccalendar>,
        @InjectRepository(AmeccalendarActivity, 'datacenterConnection')
        private readonly activityRepo: Repository<AmeccalendarActivity>,
        private readonly repo: AmeccalendarRepository,

        @InjectDataSource('datacenterConnection')
        private dataSource: DataSource,
    ) {}

    listCalendar(sdate: number, edate: number) {
        return this.calendar.find({
            where: { WORKID: Between(sdate, edate) },
            order: { WORKID: 'ASC' },
        });
    }

    async addWorkDays(startDate: number | string | Date, days: number): Promise<number> {
        startDate = this.transformDate(startDate);
        // console.log(`Adding ${days} work days to start date: ${startDate}`);

        const result = await this.dataSource.query(
            `SELECT ADD_WORK_DAYS(:1,:2) AS NEXT_DATE FROM DUAL`,
            [startDate, days],
        );

        return result[0].NEXT_DATE;
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-11-03
     * @description ดึงข้อมูลจุงการผลิตก่อนหน้า (Previous Production)
     * @param dto
     * @returns
     */
    async getPreviousProd(dto: GetProdDto) {
        const res = await this.repo.getPreviousProd(dto);
        return res.length > 0
            ? {
                  status: true,
                  message: `Previous production found ${res.length} records`,
                  data: res,
              }
            : {
                  status: false,
                  message: 'No previous production found',
                  data: [],
              };
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-11-03
     * @description ดึงข้อมูลจุงการผลิตถัดไป (Next Production)
     * @param dto
     * @returns
     */
    async getNextProd(dto: GetProdDto) {
        const res = await this.repo.getNextProd(dto);
        return res.length > 0
            ? {
                  status: true,
                  message: `Next production found ${res.length} records`,
                  data: res,
              }
            : {
                  status: false,
                  message: 'No next production found',
                  data: [],
              };
    }

    transformDate(date: number | string | Date): number {
        if (typeof date === 'number') {
            // ถ้าเป็น number อยู่แล้ว (เช่น 20250707)
            return date;
        }
        if (typeof date === 'string') {
            // ถ้าเป็น string 8 หลัก
            if (/^\d{8}$/.test(date)) {
                return parseInt(date, 10);
            }
            // ถ้าเป็น string รูปแบบวันที่ เช่น "2025-07-07"
            const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (match) {
                return parseInt(match[1] + match[2] + match[3], 10);
            }
        }
        if (date instanceof Date) {
            // ถ้าเป็น Date object
            const y = date.getFullYear();
            const m = (date.getMonth() + 1).toString().padStart(2, '0');
            const d = date.getDate().toString().padStart(2, '0');
            return parseInt(`${y}${m}${d}`, 10);
        }
    }

    /*****************************************************
     * Generate MFG Schedule
     *****************************************************/
    // ---------------------------------------------------------
    // Helper: Date Math (Native JS)
    // ---------------------------------------------------------
    private parseDate(yyyymmdd: number): Date {
        const year = Math.floor(yyyymmdd / 10000);
        const month = Math.floor((yyyymmdd % 10000) / 100) - 1;
        const day = yyyymmdd % 100;
        return new Date(year, month, day);
    }

    private formatDate(date: Date): number {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return parseInt(`${y}${m}${d}`, 10);
    }

    private addDays(date: Date, amount: number): Date {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + amount);
        return newDate;
    }

    private subDays(date: Date, amount: number): Date {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - amount);
        return newDate;
    }

    // ฟังก์ชันคำนวณวันถอยหลัง ข้ามวันหยุด
    private getPreviousWorkingDay(
        startDateId: number,
        daysToSubtract: number,
        calendar: AmecCalendar[],
    ): number {
        let currentDate = this.parseDate(startDateId);
        let workingDaysFound = 0;

        if (daysToSubtract === 0) return startDateId;

        while (workingDaysFound < daysToSubtract) {
            currentDate = this.subDays(currentDate, 1);
            const dateId = this.formatDate(currentDate);
            const calendarDay = calendar.find((day) => day.WORKID === dateId);

            if (calendarDay && calendarDay.DAYOFF === 0) {
                workingDaysFound++;
            }
        }
        return this.formatDate(currentDate);
    }

    // ฟังก์ชันหาวันทำงานถัดไปเดินหน้า (ใช้สำหรับหา WORKID คิวต่อไป)
    private getNextWorkingDays(startId: number, count: number, calendar: AmecCalendar[]): number[] {
        const result: number[] = [];
        let currentDate = this.parseDate(startId);

        // ตรวจสอบวันแรกก่อน
        let currentId = this.formatDate(currentDate);
        const startDay = calendar.find((d) => d.WORKID === currentId);
        if (startDay && startDay.DAYOFF === 0) {
            result.push(currentId);
        }

        while (result.length < count) {
            currentDate = this.addDays(currentDate, 1);
            currentId = this.formatDate(currentDate);
            const calendarDay = calendar.find((day) => day.WORKID === currentId);

            if (calendarDay && calendarDay.DAYOFF === 0) {
                result.push(currentId);
            }
        }

        return result;
    }

    // ---------------------------------------------------------
    // Main Logic: Generate Schedule For a Specific Month
    // ---------------------------------------------------------
    async generateSchedule(
        targetYear: number,
        targetMonth: number,
        startWorkId?: number,
    ): Promise<ScheduleOutput[]> {
        // 1. ดึงข้อมูลปฏิทินแบบเผื่อเวลา (ย้อนหลัง 2 เดือน เดินหน้า 2 เดือน) เพื่อให้พอคำนวณ Backward
        const fromDate = parseInt(`${targetYear - 1}1101`, 10);
        const toDate = parseInt(`${targetYear + 1}0228`, 10);

        // Mock การดึง Database (ของจริงใช้ calendarRepo)
        // const calendar = await this.calendarRepo.find({ where: { WORKID: Between(fromDate, toDate) } });
        //const calendar = this.getMockCalendar(fromDate, toDate); // ใช้ Mock สำหรับรันทดสอบ
        const calendar = await this.calendar.find({
            where: {
                WORKID: Between(fromDate, toDate),
            },
            order: {
                WORKID: 'ASC',
            },
        });

        // 2. หาวันทำงานเป้าหมาย (Axis 1: PACKING)
        const workingDaysInMonth = calendar.filter(
            (day) =>
                day.WORKYEAR === targetYear && day.WORKMONTH === targetMonth && day.DAYOFF === 0,
        );

        if (workingDaysInMonth.length === 0) return [];
        const totalWorkingDays = workingDaysInMonth.length;

        // 3. หาวันทำงานเริ่มต้นคิว (Axis 2: WORKID)
        let executionStartId = startWorkId;
        if (!executionStartId) {
            // หากไม่มีการระบุให้เริ่มที่ WORKID ไหน ให้ไปหาว่าเดือนก่อนหน้า ทำถึง WORKID อะไรแล้วเริ่มคิวถัดไป
            // (ในตัวอย่างนี้ถ้าไม่ส่งมา ขอ Default เป็นวันแรกของเดือนเป้าหมายไปก่อนเพื่อความปลอดภัย)
            executionStartId = workingDaysInMonth[0].WORKID;
        }

        // ลิสต์รายชื่อวันทำการทั้งหมดที่จะใช้เป็น WORKID แกนที่ 2 (จำนวนเท่ากับวันทำงานในเดือนเป้าหมาย)
        const executionWorkingDays = this.getNextWorkingDays(
            executionStartId,
            totalWorkingDays,
            calendar,
        );

        // 4. จัดกลุ่มและคำนวณ P1-P4
        const isApril = targetMonth === 4;
        const isDecember = targetMonth === 12;

        let activeGroups = [...SCHEDULE_GROUPS];
        if (isApril) activeGroups = activeGroups.filter((g) => g.code !== 'Y');
        if (isDecember) activeGroups = activeGroups.filter((g) => g.code !== 'C');

        const distribution = activeGroups.map((g) => ({
            code: g.code,
            no: g.no,
            pCount: 3,
        }));
        let remainingDays = totalWorkingDays - activeGroups.length * 3;

        const priorityCodes = ['X', 'Y', 'Z'];
        for (const pCode of priorityCodes) {
            if (remainingDays > 0) {
                const group = distribution.find((g) => g.code === pCode);
                if (group) {
                    group.pCount = 4;
                    remainingDays--;
                }
            }
        }

        const secondaryCodes = ['A', 'B', 'C'];
        for (const sCode of secondaryCodes) {
            if (remainingDays > 0) {
                const group = distribution.find((g) => g.code === sCode);
                if (group) {
                    group.pCount = 4;
                    remainingDays--;
                }
            }
        }

        // 5. แมปปิ้ง 2 แกนเข้าด้วยกัน (แกน Target Month กับ แกน Execution WORKID)
        const results: ScheduleOutput[] = [];
        let dayIndex = 0;

        for (const group of distribution) {
            for (let p = 1; p <= group.pCount; p++) {
                if (dayIndex >= totalWorkingDays) break;

                // แกน 1: วันที่เป้าหมายการผลิต (เอาไว้คำนวณถอยหลัง)
                const packingDate = workingDaysInMonth[dayIndex].WORKID;

                // แกน 2: วันคิวงานที่ระบุ
                const currentWorkId = executionWorkingDays[dayIndex];

                // คำนวณวันย้อนหลังอ้างอิงจากแกน 1 (packingDate)
                const inspectionDate = this.getPreviousWorkingDay(packingDate, 1, calendar);
                const assyDate = this.getPreviousWorkingDay(inspectionDate, 1, calendar);
                const paintDate = this.getPreviousWorkingDay(assyDate, 1, calendar);

                // กระบวนการ 3 วัน (Finish ก่อน แล้ว Start ถอยไปอีก 2 วัน)
                const subAssyFinishDate = this.getPreviousWorkingDay(paintDate, 1, calendar);
                const subAssyStartDate = this.getPreviousWorkingDay(subAssyFinishDate, 2, calendar);

                const feeder2FinishDate = this.getPreviousWorkingDay(subAssyStartDate, 1, calendar);
                const feeder2StartDate = this.getPreviousWorkingDay(feeder2FinishDate, 2, calendar);

                const feeder1FinishDate = this.getPreviousWorkingDay(feeder2StartDate, 1, calendar);
                const feeder1StartDate = this.getPreviousWorkingDay(feeder1FinishDate, 2, calendar);

                const ncProgramDate = this.getPreviousWorkingDay(feeder1StartDate, 1, calendar);

                // Construct Output
                const yyyyMm = parseInt(`${targetYear}${String(targetMonth).padStart(2, '0')}`, 10);

                results.push({
                    workId: currentWorkId, // ใช้ Axis 2 เป็นคิวงาน
                    schdNumber: parseInt(`${yyyyMm}${group.no}`, 10),
                    schdMfg: `${yyyyMm}${group.code}`,
                    subGroup: `P${p}`,

                    packingDate, // ใช้ Axis 1
                    inspectionDate,
                    assyDate,
                    paintDate,
                    subAssyStartDate,
                    subAssyFinishDate,
                    feeder2StartDate,
                    feeder2FinishDate,
                    feeder1StartDate,
                    feeder1FinishDate,
                    ncProgramDate,
                });

                dayIndex++;
            }
        }
        /*
        // 1. คำนวณช่วงเวลาที่จะต้องดึงข้อมูลจาก Database
        // ต้องดึงย้อนหลังไปอย่างน้อย 2 เดือน เพื่อให้ครอบคลุมการนับวันถอยหลังข้ามเดือน (Backward Scheduling)
        let startYear = targetYear;
        let startMonth = targetMonth - 2;
        if (startMonth <= 0) {
            startYear -= 1;
            startMonth += 12;
        }

        const startId = startYear * 10000 + startMonth * 100 + 1; // เช่น 20251101

        // หาวันสุดท้ายของเดือนเป้าหมาย
        const nextMonth = targetMonth === 12 ? 1 : targetMonth + 1;
        const nextMonthYear = targetMonth === 12 ? targetYear + 1 : targetYear;
        const targetMonthLastDate = new Date(nextMonthYear, nextMonth - 1, 0); // วันที่ 0 คือวันสุดท้ายของเดือนก่อนหน้า
        const endId =
            targetYear * 10000 +
            targetMonth * 100 +
            targetMonthLastDate.getDate(); // เช่น 20260131

        // ดึงข้อมูลปฏิทินจาก Database ในช่วงที่กำหนด
        const calendars = await this.calendar.find({
            where: {
                WORKID: Between(startId, endId),
            },
            order: {
                WORKID: 'ASC',
            },
        });

        // 2. ดึงเฉพาะวันทำงานของเดือนเป้าหมาย เพื่อใช้กำหนดวัน PACKING
        const targetMonthPrefix = targetYear * 100 + targetMonth; // เช่น 202604
        const workingDaysInMonth = calendars.filter(
            (day) =>
                Math.floor(day.WORKID / 100) === targetMonthPrefix &&
                day.DAYOFF === 0,
        );

        if (workingDaysInMonth.length === 0) return []; // ถ้าไม่มีวันทำงานเลยในเดือนนี้ ให้คืนค่าว่าง
        const totalWorkingDays = workingDaysInMonth.length;

        // 3. กฎพิเศษของแต่ละเดือน
        const isApril = targetMonth === 4;
        const isDecember = targetMonth === 12;

        let activeGroups = [...SCHEDULE_GROUPS];
        if (isApril) {
            activeGroups = activeGroups.filter((g) => g.code !== 'Y'); // เดือน 4 ข้าม Y
        }
        if (isDecember) {
            activeGroups = activeGroups.filter((g) => g.code !== 'C'); // เดือน 12 ข้าม C
        }

        // 4. กระจายวันทำงานลงกลุ่ม (X, A, Y, B, Z, C) และกำหนดค่า P (3 หรือ 4)
        let distribution: { code: string; no: number; pCount: number }[] =
            activeGroups.map((g) => ({
                code: g.code,
                no: g.no,
                pCount: 3, // ให้ค่าเริ่มต้นที่ 3P ทุกกลุ่มก่อน
            }));

        let remainingDays = totalWorkingDays - activeGroups.length * 3;

        // กฎ: ถ้าต้องเกิน 3P ให้เอาลง schedule X, Y, Z ก่อน แล้วค่อยเอาลง A, B, C ตามลำดับ
        const priorityCodes = ['X', 'Y', 'Z'];
        for (const pCode of priorityCodes) {
            if (remainingDays > 0) {
                const group = distribution.find((g) => g.code === pCode);
                if (group) {
                    group.pCount = 4;
                    remainingDays--;
                }
            }
        }
        const secondaryCodes = ['A', 'B', 'C'];
        for (const sCode of secondaryCodes) {
            if (remainingDays > 0) {
                const group = distribution.find((g) => g.code === sCode);
                if (group) {
                    group.pCount = 4;
                    remainingDays--;
                }
            }
        }

        // 5. นำวันทำงานมา Map และคำนวณย้อนหลัง (Backward Scheduling)
        let dayIndex = 0;

        for (const group of distribution) {
            for (let p = 1; p <= group.pCount; p++) {
                // หากไม่มีวันทำงานให้ Map แล้วให้เบรก
                if (dayIndex >= workingDaysInMonth.length) break;

                const packingDate = workingDaysInMonth[dayIndex].WORKID;

                // --- การคำนวณถอยหลังตามสูตร ---
                // PACKING: Start Date / Finish date วันเดียวกัน
                // Inspection: ก่อน Packing 1 วัน
                const inspectionDate = this.getPreviousWorkingDay(
                    packingDate,
                    calendars,
                    1,
                );

                // Assy: ก่อน Inspection 1 วัน
                const assyDate = this.getPreviousWorkingDay(
                    inspectionDate,
                    calendars,
                    1,
                );

                // Paint: ก่อน Assy 1 วัน
                const paintDate = this.getPreviousWorkingDay(
                    assyDate,
                    calendars,
                    1,
                );

                // Sub Assy: กินเวลา 3 วัน (Finish ถอย 1 วันจาก Paint, Start ถอย 2 วันจาก Finish)
                const subAssyFinishDate = this.getPreviousWorkingDay(
                    paintDate,
                    calendars,
                    1,
                );
                const subAssyStartDate = this.getPreviousWorkingDay(
                    subAssyFinishDate,
                    calendars,
                    2,
                );

                // Feeder2: กินเวลา 3 วัน (Finish ถอย 1 วันจาก Start ของ Sub Assy)
                const feeder2FinishDate = this.getPreviousWorkingDay(
                    subAssyStartDate,
                    calendars,
                    1,
                );
                const feeder2StartDate = this.getPreviousWorkingDay(
                    feeder2FinishDate,
                    calendars,
                    2,
                );

                // Feeder1: กินเวลา 3 วัน (Finish ถอย 1 วันจาก Start ของ Feeder2)
                const feeder1FinishDate = this.getPreviousWorkingDay(
                    feeder2StartDate,
                    calendars,
                    1,
                );
                const feeder1StartDate = this.getPreviousWorkingDay(
                    feeder1FinishDate,
                    calendars,
                    2,
                );

                // NC Program: ก่อน Start ของ Feeder1 1 วัน
                const ncProgramDate = this.getPreviousWorkingDay(
                    feeder1StartDate,
                    calendars,
                    1,
                );

                // สร้าง Object ผลลัพธ์
                const schdNumber =
                    targetYear * 1000 + targetMonth * 10 + group.no; // เช่น 2026041

                results.push({
                    workId: packingDate,
                    schdNumber: schdNumber,
                    schdMfg: `${targetYear}${targetMonth.toString().padStart(2, '0')}${group.code}`, // เช่น '202604X'
                    subGroup: `P${p}`,
                    packingDate,
                    inspectionDate,
                    assyDate,
                    paintDate,
                    subAssyStartDate,
                    subAssyFinishDate,
                    feeder2StartDate,
                    feeder2FinishDate,
                    feeder1StartDate,
                    feeder1FinishDate,
                    ncProgramDate,
                });

                dayIndex++;
            }
        }*/

        return results;
    }

    public async generateYearlySchedule(
        year: number,
        initialMonth: number,
        initialWorkId?: number,
    ): Promise<ScheduleOutput[]> {
        const yearlySchedule: ScheduleOutput[] = [];
        let currentStartWorkId = initialWorkId;

        // รันตั้งแต่ initialMonth ของปีเริ่มต้น ไปจนถึงเดือน 3 ของปีถัดไป
        const totalMonths = 12 - initialMonth + 1 + 3;

        for (let i = 0; i < totalMonths; i++) {
            const monthOffset = initialMonth - 1 + i;
            const currentYear = year + Math.floor(monthOffset / 12);
            const currentMonth = (monthOffset % 12) + 1;

            const monthSchedule = await this.generateSchedule(
                currentYear,
                currentMonth,
                currentStartWorkId,
            );

            if (monthSchedule.length > 0) {
                yearlySchedule.push(...monthSchedule);

                // คิวสุดท้ายของเดือนนี้
                const lastWorkIdThisMonth = monthSchedule[monthSchedule.length - 1].workId;
                const calendar = await this.calendar.find({
                    where: {
                        WORKID: Between(
                            lastWorkIdThisMonth,
                            parseInt(`${currentYear + 1}1231`, 10),
                        ),
                    },
                    order: {
                        WORKID: 'ASC',
                    },
                });

                // ขยับไปหาวันทำงานถัดไปเพื่อใช้เป็น initialWorkId ของเดือนหน้า
                const nextDays = this.getNextWorkingDays(lastWorkIdThisMonth, 2, calendar);
                currentStartWorkId = nextDays.length > 1 ? nextDays[1] : null;
            }
        }

        return yearlySchedule;
    }

    /*****************************************************
     * Calendar Admin & Company Activities
     *****************************************************/
    private validateWorkId(workId: number): {
        year: number;
        month: number;
        day: number;
        fyear: number;
        workNum: number;
    } {
        if (!Number.isInteger(workId) || workId < 19000101 || workId > 29991231) {
            throw new BadRequestException(`Invalid WORKID format (expected YYYYMMDD): ${workId}`);
        }
        const year = Math.floor(workId / 10000);
        const month = Math.floor((workId % 10000) / 100);
        const day = workId % 100;
        const date = new Date(year, month - 1, day);
        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            throw new BadRequestException(`Invalid calendar date for WORKID: ${workId}`);
        }
        const dow = date.getDay(); // 0=Sun..6=Sat
        return {
            year,
            month,
            day,
            fyear: month >= 4 ? year : year - 1,
            workNum: dow === 0 ? 7 : dow,
        };
    }

    private formatActivityResponse(row: AmeccalendarActivity) {
        return {
            ...row,
            TYPE: row.CATEGORY,
        };
    }

    private async upsertCalendarDayWithManager(
        manager: EntityManager,
        workId: number,
        params: {
            dayOff: number;
            workHour: number;
            workHourOt: number;
            dayType: 'WORKDAY' | 'HOLIDAY' | 'WORKING_SATURDAY' | 'WEEKEND';
            title?: string;
            description?: string;
            updateBy?: string;
        },
    ) {
        const meta = this.validateWorkId(workId);
        const now = new Date();
        const updateBy = params.updateBy?.trim() || null;

        const existingDay = await manager.findOne(Ameccalendar, {
            where: { WORKID: workId },
        });

        if (existingDay) {
            await manager.update(
                Ameccalendar,
                { WORKID: workId },
                {
                    DAYOFF: params.dayOff,
                    WORKHOUR: params.workHour,
                    WORKHOUROT: params.workHourOt,
                },
            );
        } else {
            const newDay = manager.create(Ameccalendar, {
                WORKID: workId,
                FYEAR: meta.fyear,
                WORKYEAR: meta.year,
                WORKMONTH: meta.month,
                WORKDAY: meta.day,
                WORKNUM: meta.workNum,
                DAYOFF: params.dayOff,
                WORKHOUR: params.workHour,
                WORKHOUROT: params.workHourOt,
            });
            await manager.save(Ameccalendar, newDay);
        }

        const existingMeta = await manager.findOne(AmeccalendarActivity, {
            where: {
                WORKID: workId,
                CATEGORY: In(['HOLIDAY', 'WORKING_SATURDAY']),
            },
        });

        if (params.dayType === 'HOLIDAY' || params.dayType === 'WORKING_SATURDAY') {
            const title =
                params.title?.trim() ||
                (params.dayType === 'WORKING_SATURDAY' ? 'วันเสาร์ทำงาน' : '');
            const description = params.description?.trim() || null;

            if (existingMeta) {
                await manager.update(
                    AmeccalendarActivity,
                    { ID: existingMeta.ID },
                    {
                        CATEGORY: params.dayType,
                        TITLE: title,
                        DESCRIPTION: description,
                        UPDATE_BY: updateBy,
                        UPDATE_DATE: now,
                    },
                );
            } else {
                const newMeta = manager.create(AmeccalendarActivity, {
                    WORKID: workId,
                    WORKYEAR: meta.year,
                    CATEGORY: params.dayType,
                    TITLE: title,
                    DESCRIPTION: description,
                    CREATE_BY: updateBy,
                    CREATE_DATE: now,
                    UPDATE_BY: updateBy,
                    UPDATE_DATE: now,
                });
                await manager.save(AmeccalendarActivity, newMeta);
            }
        } else if (existingMeta) {
            await manager.delete(AmeccalendarActivity, { ID: existingMeta.ID });
        }
    }

    async getActivitiesByYear(year: number) {
        if (!Number.isInteger(year) || year < 1900 || year > 2999) {
            throw new BadRequestException(`Invalid year: ${year}`);
        }

        const rows = await this.activityRepo.find({
            where: { WORKYEAR: year },
            order: { WORKID: 'ASC', ID: 'ASC' },
        });

        return rows.map((row) => this.formatActivityResponse(row));
    }

    async updateCalendarDay(workId: number, dto: UpdateCalendarDayDto) {
        this.validateWorkId(workId);

        const trimmedTitle = dto.TITLE?.trim() || '';
        if (dto.DAY_TYPE === 'HOLIDAY' && !trimmedTitle) {
            throw new BadRequestException('TITLE is required when DAY_TYPE is HOLIDAY');
        }

        await this.dataSource.transaction(async (manager) => {
            await this.upsertCalendarDayWithManager(manager, workId, {
                dayOff: dto.DAYOFF,
                workHour: dto.WORKHOUR,
                workHourOt: dto.WORKHOUROT,
                dayType: dto.DAY_TYPE,
                title: trimmedTitle,
                description: dto.DESCRIPTION,
                updateBy: dto.UPDATE_BY,
            });
        });

        return {
            status: true,
            message: 'Updated calendar day successfully',
            data: {
                WORKID: workId,
                DAYOFF: dto.DAYOFF,
                WORKHOUR: dto.WORKHOUR,
                WORKHOUROT: dto.WORKHOUROT,
                DAY_TYPE: dto.DAY_TYPE,
                TITLE:
                    dto.DAY_TYPE === 'HOLIDAY' || dto.DAY_TYPE === 'WORKING_SATURDAY'
                        ? trimmedTitle
                        : '',
                DESCRIPTION:
                    dto.DAY_TYPE === 'HOLIDAY' || dto.DAY_TYPE === 'WORKING_SATURDAY'
                        ? dto.DESCRIPTION?.trim() || ''
                        : '',
            },
        };
    }

    async bulkUpdateCalendar(dto: BulkUpdateCalendarDto) {
        const uniqueWorkIds = Array.from(new Set(dto.WORKIDS));
        for (const workId of uniqueWorkIds) {
            this.validateWorkId(workId);
        }

        const trimmedTitle = dto.TITLE?.trim() || '';
        if ((dto.DAY_TYPE === 'HOLIDAY' || dto.DAY_TYPE === 'EVENT') && !trimmedTitle) {
            throw new BadRequestException(
                `TITLE is required when DAY_TYPE is ${dto.DAY_TYPE}`,
            );
        }

        const now = new Date();
        const updateBy = dto.UPDATE_BY?.trim() || null;
        const description = dto.DESCRIPTION?.trim() || null;

        await this.dataSource.transaction(async (manager) => {
            if (dto.DAY_TYPE === 'EVENT') {
                const entities = uniqueWorkIds.map((workId) =>
                    manager.create(AmeccalendarActivity, {
                        WORKID: workId,
                        WORKYEAR: Math.floor(workId / 10000),
                        CATEGORY: 'EVENT',
                        TITLE: trimmedTitle,
                        DESCRIPTION: description,
                        CREATE_BY: updateBy,
                        CREATE_DATE: now,
                        UPDATE_BY: updateBy,
                        UPDATE_DATE: now,
                    }),
                );
                await manager.save(AmeccalendarActivity, entities);
                return;
            }

            const isOff = dto.DAY_TYPE === 'HOLIDAY';
            const dayOff = dto.DAYOFF ?? (isOff ? 1 : 0);
            const workHour = dto.WORKHOUR ?? (isOff ? 0 : 8);
            const workHourOt = dto.WORKHOUROT ?? (isOff ? 8 : 2);

            for (const workId of uniqueWorkIds) {
                await this.upsertCalendarDayWithManager(manager, workId, {
                    dayOff,
                    workHour,
                    workHourOt,
                    dayType: dto.DAY_TYPE,
                    title: trimmedTitle,
                    description: dto.DESCRIPTION,
                    updateBy: dto.UPDATE_BY,
                });
            }
        });

        return {
            status: true,
            message: `Bulk updated ${uniqueWorkIds.length} day(s) successfully`,
            affectedCount: uniqueWorkIds.length,
        };
    }

    async createActivity(dto: CreateCalendarActivityDto) {
        const meta = this.validateWorkId(dto.WORKID);
        const title = dto.TITLE?.trim();
        if (!title) {
            throw new BadRequestException('TITLE is required');
        }

        const category = (dto.CATEGORY || dto.TYPE || 'EVENT').toUpperCase();
        const now = new Date();
        const updateBy = dto.UPDATE_BY?.trim() || null;

        const entity = this.activityRepo.create({
            WORKID: dto.WORKID,
            WORKYEAR: meta.year,
            CATEGORY: category,
            TITLE: title,
            DESCRIPTION: dto.DESCRIPTION?.trim() || null,
            CREATE_BY: updateBy,
            CREATE_DATE: now,
            UPDATE_BY: updateBy,
            UPDATE_DATE: now,
        });

        const saved = await this.activityRepo.save(entity);
        const formatted = this.formatActivityResponse(saved);

        return {
            status: true,
            message: 'Created activity successfully',
            ID: saved.ID,
            data: formatted,
        };
    }

    async updateActivity(id: number, dto: UpdateCalendarActivityDto) {
        const existing = await this.activityRepo.findOne({ where: { ID: id } });
        if (!existing) {
            throw new NotFoundException(`Activity ID ${id} not found`);
        }

        if (dto.WORKID !== undefined) {
            const meta = this.validateWorkId(dto.WORKID);
            existing.WORKID = dto.WORKID;
            existing.WORKYEAR = meta.year;
        }

        if (dto.CATEGORY || dto.TYPE) {
            existing.CATEGORY = (dto.CATEGORY || dto.TYPE).toUpperCase();
        }

        if (dto.TITLE !== undefined) {
            const title = dto.TITLE.trim();
            if (!title) {
                throw new BadRequestException('TITLE cannot be empty');
            }
            existing.TITLE = title;
        }

        if (dto.DESCRIPTION !== undefined) {
            existing.DESCRIPTION = dto.DESCRIPTION.trim() || null;
        }

        existing.UPDATE_BY = dto.UPDATE_BY?.trim() || existing.UPDATE_BY;
        existing.UPDATE_DATE = new Date();

        const updated = await this.activityRepo.save(existing);

        return {
            status: true,
            message: 'Updated activity successfully',
            data: this.formatActivityResponse(updated),
        };
    }

    async deleteActivity(id: number) {
        const existing = await this.activityRepo.findOne({ where: { ID: id } });
        if (!existing) {
            throw new NotFoundException(`Activity ID ${id} not found`);
        }

        await this.activityRepo.delete({ ID: id });

        return {
            status: true,
            message: 'Deleted activity successfully',
            deletedId: id,
        };
    }
}
