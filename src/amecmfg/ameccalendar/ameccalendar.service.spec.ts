import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AmeccalendarService } from './ameccalendar.service';
import { Ameccalendar } from './entities/ameccalendar.entity';
import { AmeccalendarActivity } from 'src/common/Entities/datacenter/table/AMECCALENDAR_ACTIVITY.entity';

describe('AmeccalendarService (Calendar Admin & Activities)', () => {
    let service: AmeccalendarService;
    let calendarRepo: any;
    let activityRepo: any;
    let mockManager: any;
    let dataSource: any;

    beforeEach(() => {
        calendarRepo = {
            find: jest.fn(),
        };

        activityRepo = {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn((data) => ({ ...data })),
            save: jest.fn(async (entity) => ({ ID: 101, ...entity })),
            delete: jest.fn(),
        };

        mockManager = {
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn((_cls, data) => ({ ...data })),
            save: jest.fn(async (_cls, data) => data),
            delete: jest.fn(),
        };

        dataSource = {
            query: jest.fn(),
            transaction: jest.fn(async (cb) => cb(mockManager)),
        };

        service = new AmeccalendarService(
            calendarRepo,
            activityRepo,
            {} as any,
            dataSource,
        );
    });

    it('getActivitiesByYear returns activities with TYPE alias', async () => {
        activityRepo.find.mockResolvedValue([
            { ID: 1, WORKID: 20260413, WORKYEAR: 2026, CATEGORY: 'HOLIDAY', TITLE: 'วันสงกรานต์' },
        ]);

        const res = await service.getActivitiesByYear(2026);

        expect(activityRepo.find).toHaveBeenCalledWith({
            where: { WORKYEAR: 2026 },
            order: { WORKID: 'ASC', ID: 'ASC' },
        });
        expect(res).toEqual([
            {
                ID: 1,
                WORKID: 20260413,
                WORKYEAR: 2026,
                CATEGORY: 'HOLIDAY',
                TYPE: 'HOLIDAY',
                TITLE: 'วันสงกรานต์',
            },
        ]);
    });

    it('updateCalendarDay rejects HOLIDAY without TITLE', async () => {
        await expect(
            service.updateCalendarDay(20260413, {
                DAYOFF: 1,
                WORKHOUR: 0,
                WORKHOUROT: 8,
                DAY_TYPE: 'HOLIDAY',
                TITLE: '   ',
            }),
        ).rejects.toThrow(BadRequestException);
    });

    it('updateCalendarDay updates AMECCALENDAR and inserts HOLIDAY metadata', async () => {
        mockManager.findOne
            .mockResolvedValueOnce({ WORKID: 20260413 }) // existing AMECCALENDAR
            .mockResolvedValueOnce(null); // no existing meta

        const res = await service.updateCalendarDay(20260413, {
            DAYOFF: 1,
            WORKHOUR: 0,
            WORKHOUROT: 8,
            DAY_TYPE: 'HOLIDAY',
            TITLE: 'วันสงกรานต์',
            DESCRIPTION: 'หยุดประจำปี',
            UPDATE_BY: '24008',
        });

        expect(mockManager.update).toHaveBeenCalledWith(
            Ameccalendar,
            { WORKID: 20260413 },
            { DAYOFF: 1, WORKHOUR: 0, WORKHOUROT: 8 },
        );
        expect(mockManager.save).toHaveBeenCalledWith(
            AmeccalendarActivity,
            expect.objectContaining({
                WORKID: 20260413,
                WORKYEAR: 2026,
                CATEGORY: 'HOLIDAY',
                TITLE: 'วันสงกรานต์',
            }),
        );
        expect(res.status).toBe(true);
    });

    it('updateCalendarDay removes holiday metadata when reset to WORKDAY', async () => {
        mockManager.findOne
            .mockResolvedValueOnce({ WORKID: 20260413 })
            .mockResolvedValueOnce({ ID: 55, CATEGORY: 'HOLIDAY' });

        await service.updateCalendarDay(20260413, {
            DAYOFF: 0,
            WORKHOUR: 8,
            WORKHOUROT: 2,
            DAY_TYPE: 'WORKDAY',
        });

        expect(mockManager.delete).toHaveBeenCalledWith(AmeccalendarActivity, { ID: 55 });
    });

    it('bulkUpdateCalendar inserts EVENT activities without modifying AMECCALENDAR', async () => {
        const res = await service.bulkUpdateCalendar({
            WORKIDS: [20260615, 20260616, 20260615],
            DAY_TYPE: 'EVENT',
            TITLE: 'ซ้อมหนีไฟ',
            UPDATE_BY: '24008',
        });

        expect(res.affectedCount).toBe(2);
        expect(mockManager.save).toHaveBeenCalledWith(
            AmeccalendarActivity,
            expect.arrayContaining([
                expect.objectContaining({ WORKID: 20260615, CATEGORY: 'EVENT', TITLE: 'ซ้อมหนีไฟ' }),
                expect.objectContaining({ WORKID: 20260616, CATEGORY: 'EVENT', TITLE: 'ซ้อมหนีไฟ' }),
            ]),
        );
        expect(mockManager.update).not.toHaveBeenCalled();
    });

    it('createActivity returns top-level ID and data', async () => {
        const res = await service.createActivity({
            WORKID: 20260615,
            CATEGORY: 'TRAINING',
            TITLE: 'อบรมความปลอดภัย',
            UPDATE_BY: '24008',
        });

        expect(res.status).toBe(true);
        expect(res.ID).toBe(101);
        expect(res.data.TYPE).toBe('TRAINING');
    });

    it('updateActivity & deleteActivity throw NotFoundException when ID does not exist', async () => {
        activityRepo.findOne.mockResolvedValue(null);

        await expect(service.updateActivity(999, { TITLE: 'test' })).rejects.toThrow(
            NotFoundException,
        );
        await expect(service.deleteActivity(999)).rejects.toThrow(NotFoundException);
    });
});
