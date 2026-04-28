import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DailyDispatchReportDto } from './dto/dispatch-report.dto';

import { BusDispatchHead } from '../../common/Entities/gpreport/table/bus_dispatch_head.entity';
import { BusDispatchLine } from '../../common/Entities/gpreport/table/bus_dispatch_line.entity';
import { BusDispatchStop } from '../../common/Entities/gpreport/table/bus_dispatch_stop.entity';
import { BusDispatchPassenger } from '../../common/Entities/gpreport/table/bus_dispatch_passenger.entity';

@Injectable()
export class DispatchReportService {
    constructor(
        @InjectDataSource('gpreportConnection')
        private readonly dataSource: DataSource,

        @InjectRepository(BusDispatchPassenger, 'gpreportConnection')
        private passRepo: Repository<BusDispatchPassenger>,
    ) {}

    async getReportBus(dto: DailyDispatchReportDto) {
        const dispatchId = Number(dto.dispatch_id);

        const lines = await this.dataSource
            .getRepository(BusDispatchLine)
            .createQueryBuilder('l')
            .where('l.dispatch_id = :dispatchId', { dispatchId })
            .andWhere("NVL(l.line_status, '1') = '1'")
            .orderBy('l.busid', 'ASC')
            .getMany();

        const stops = await this.dataSource
            .getRepository(BusDispatchStop)
            .createQueryBuilder('s')
            .where('s.dispatch_id = :dispatchId', { dispatchId })
            .orderBy('s.line_id', 'ASC')
            .addOrderBy('s.plan_time', 'DESC')
            .addOrderBy('s.stop_id', 'ASC')
            .getMany();

        const passengers = await this.dataSource
            .getRepository(BusDispatchPassenger)
            .createQueryBuilder('p')
            .leftJoin(
                'AMECUSERALL',
                'u',
                'TRIM(TO_CHAR(u.SEMPNO)) = TRIM(TO_CHAR(p.empno))',
            )
            .select('p.EMPNO', 'empno')
            .addSelect('p.STOP_ID', 'stop_id')
            .addSelect('u.STNAME', 'fullname')
            .addSelect('u.SDEPT', 'dept')
            .addSelect('u.SSEC', 'sec')
            .addSelect('u.SDIV', 'div')
            .where('p.dispatch_id = :dispatchId', { dispatchId })
            .andWhere("NVL(p.status, 'E') = 'E'")
            .orderBy('p.stop_id', 'ASC')
            .addOrderBy('p.empno', 'ASC')
            .getRawMany();

        const resultLines = lines.map((line) => {
            const lineStops = stops
                .filter((s) => s.LINE_ID === line.BUSID)
                .map((stop) => {
                    const stopPassengers = passengers
                        .filter(
                            (p) => Number(p.STOP_ID) === Number(stop.STOP_ID),
                        )
                        .map((p, index) => ({
                            no: index + 1,
                            empno: p.empno || '',
                            fullname: p.fullname || '',
                            dept: p.dept || '',
                            sec: p.sec || '',
                            div: p.div || '',
                        }));

                    return {
                        stop_id: stop.STOP_ID,
                        stop_name: stop.STOP_NAME || '',
                        plan_time: stop.PLAN_TIME || '',
                        passengers: stopPassengers,
                    };
                });

            return {
                busid: line.BUSID,
                busname: line.BUSNAME || '',
                bustype: line.BUSTYPE || '',
                busseat: line.BUSSEAT,
                line_status: line.LINE_STATUS || '',
                stops: lineStops,
            };
        });

        return {
            status: true,
            dispatch_id: dispatchId,
            title: await this.buildDispatchReportTitle(dispatchId),
            lines: resultLines,
            message: 'ok',
        };
    }

    async getReportDisabledPassenger(dto: DailyDispatchReportDto) {
        const dispatchId = Number(dto.dispatch_id);

        const passengers = await this.passRepo
            .createQueryBuilder('p')
            .leftJoin(
                BusDispatchStop,
                's',
                's.dispatch_id = p.dispatch_id AND s.stop_id = p.stop_id',
            )
            .leftJoin(
                'AMECUSERALL',
                'u',
                'TRIM(TO_CHAR(u.SEMPNO)) = TRIM(TO_CHAR(p.empno))',
            )
            .select('p.EMPNO', 'empno')
            .addSelect('s.STOP_NAME', 'stop_name')
            .addSelect('s.PLAN_TIME', 'plan_time')
            .addSelect('u.STNAME', 'fullname')
            .addSelect('u.SSEC', 'sec')
            .addSelect('u.SDEPT', 'dept')
            .addSelect('u.SDIV', 'div')
            .where('p.dispatch_id = :dispatchId', { dispatchId })
            .andWhere("NVL(p.status, 'E') = 'D'")
            .orderBy('p.empno', 'ASC')
            .getRawMany();

        const rows = passengers.map((row, index) => ({
            no: index + 1,
            empno: row.empno || '',
            fullname: row.fullname || '',
            sec: row.sec || '',
            dept: row.dept || '',
            div: row.div || '',
            stop_name: row.stop_name || '',
            plan_time: row.plan_time || '',
        }));

        const displayInfo = await this.getDispatchDisplayInfo(dispatchId);

        return {
            status: true,
            dispatch_id: dispatchId,
            title: 'รายชื่อผู้ที่ไม่สามารถจัดรถรับส่งได้',
            display_date_text: displayInfo.display_date_text,
            display_time_text: displayInfo.display_time_text,
            rows,
            message: 'ok',
        };
    }

    private async getDispatchDisplayInfo(dispatchId: number) {
        const head = await this.dataSource
            .getRepository(BusDispatchHead)
            .createQueryBuilder('h')
            .where('h.dispatch_id = :dispatchId', { dispatchId })
            .getOne();

        if (!head) {
            return {
                display_date_text: '-',
                display_time_text: '',
                title: 'ตารางรถรับส่งพนักงาน',
            };
        }

        const displayDateText = head.DISPATCH_DATE
            ? new Date(head.DISPATCH_DATE).toLocaleDateString('th-TH')
            : '-';

        let displayTimeText = '';
        if (head.DISPATCH_TYPE === 'O' && head.SHIFT === 'D')
            displayTimeText = 'OT เวลา 19.30 น.';
        else if (head.DISPATCH_TYPE === 'O' && head.SHIFT === 'S')
            displayTimeText = 'OT เวลา 21.30 น.';
        else if (head.DISPATCH_TYPE === 'O' && head.SHIFT === 'N')
            displayTimeText = 'OT (กะกลางคืน) เวลา 07.30 น.';
        else if (head.SHIFT === 'H') displayTimeText = 'OT เวลา 17.00 น.';

        return {
            display_date_text: displayDateText,
            display_time_text: displayTimeText,
            title: `ตารางรถรับส่งพนักงาน ${displayTimeText} ประจำวันที่ ${displayDateText}`,
        };
    }

    private async buildDispatchReportTitle(dispatchId: number) {
        const info = await this.getDispatchDisplayInfo(dispatchId);
        return info.title;
    }
}
