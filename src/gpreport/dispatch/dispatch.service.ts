import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';
import { SaveDispatchDto } from './dto/save-dispatch.dto';
import { SaveOverwriteDto } from './dto/save-overwrite.dto';
import { BuildDailyFirstDto } from './dto/build-daily-first.dto';
import { DailyDispatchReportDto } from './dto/dispatch-report.dto';

import { BusDispatchHead } from '../../common/Entities/gpreport/table/bus_dispatch_head.entity';
import { BusDispatchLine } from '../../common/Entities/gpreport/table/bus_dispatch_line.entity';
import { BusDispatchStop } from '../../common/Entities/gpreport/table/bus_dispatch_stop.entity';
import { BusDispatchPassenger } from '../../common/Entities/gpreport/table/bus_dispatch_passenger.entity';
import { DispatchKeyDto } from './dto/dispatch-key.dto';
import { MoveStopDto } from './dto/move-stop.dto';
import { SaveAddPassengerDto } from './dto/save-add-passenger.dto';
import { UpdateStatusDispatchDto } from './dto/update-status-dispatch.dto';
import { UpdatePassengerStatusDto } from './dto/update-passenger-status.dto';
import { UpdateLineStatusDto } from './dto/update-line-status.dto';
import { UpdateLineTypeDto } from './dto/update-line-type.dto';
import { RunDailyScheduleDto } from './dto/build-run-daily-schedule.dto';

import { ExportAndSendMailDto } from './dto/export-and-sendmail.dto';
import * as path from 'path';
import * as ExcelJS from 'exceljs';
import * as dayjs from 'dayjs';
import * as fs from 'fs-extra';
import * as nodemailer from 'nodemailer';

@Injectable()
export class DispatchService {
  constructor(
    @InjectDataSource('gpreportConnection')
    private readonly dataSource: DataSource,

    @InjectRepository(BusDispatchHead, 'gpreportConnection')
    private headRepo: Repository<BusDispatchHead>,

    @InjectRepository(BusDispatchLine, 'gpreportConnection')
    private lineRepo: Repository<BusDispatchLine>,

    @InjectRepository(BusDispatchStop, 'gpreportConnection')
    private stopRepo: Repository<BusDispatchStop>,

    @InjectRepository(BusDispatchPassenger, 'gpreportConnection')
    private passRepo: Repository<BusDispatchPassenger>,
  ) {}

  async updateStatus(dto: UpdateStatusDispatchDto) {
    const head = await this.headRepo.findOne({
      where: { dispatch_id: dto.dispatch_id },
    });

    if (!head) throw new Error('DISPATCH_NOT_FOUND');

    head.status = dto.status;
    await this.headRepo.save(head);
    return { dispatch_id: head.dispatch_id, ok: true };
  }

  async updateDispatchStatusHead(dto: SaveDispatchDto) {
    const head = await this.headRepo.findOne({
      where: { dispatch_id: dto.dispatch_id },
    });

    if (!head) throw new Error('DISPATCH_NOT_FOUND');

    head.status = dto.status;
    head.update_by = dto.update_by;
    head.update_date = new Date();

    await this.headRepo.save(head);

    return {
      dispatch_id: head.dispatch_id,
      status: head.status,
      message: 'อัปเดตสถานะเรียบร้อย',
    };
  }




  async saveOverwrite(dto: SaveOverwriteDto) {
    const head = await this.headRepo.findOne({
      where: { dispatch_id: dto.dispatch_id },
    });

    if (!head) throw new Error('DISPATCH_NOT_FOUND');
    if (head.status === 'C') throw new Error('DISPATCH_CLOSED');

    head.update_by = dto.update_by;
    head.update_date = new Date();

    await this.headRepo.save(head);
    return { dispatch_id: head.dispatch_id, ok: true };
  }

  private pickPlanTime(shift: string, r: any): string | null {
    if (shift === 'D') return r.WORKDAY_TIMEIN ? String(r.WORKDAY_TIMEIN).trim() : null;
    if (shift === 'N') return r.NIGHT_TIMEIN ? String(r.NIGHT_TIMEIN).trim() : null;
    if (shift === 'H') return r.HOLIDAY_TIMEIN ? String(r.HOLIDAY_TIMEIN).trim() : null;
    return null;
  }



// ==================================================== build-daily-first ==================================================== //
async buildDailyFirst(dto: BuildDailyFirstDto) {
  const workDate = dto.workdate;
  const shift = dto.shift;

  return this.dataSource.transaction(async (manager) => {
    // 1) ensure head
    let head = await manager.findOne(BusDispatchHead, {
      where: {
        dispatch_date: workDate,
        dispatch_type: dto.dispatch_type,
        shift,
      },
    });

    if (!head) {
      head = await manager.save(
        manager.create(BusDispatchHead, {
          dispatch_date: workDate,
          dispatch_type: dto.dispatch_type,
          shift,
          status: 'D',
          update_by: dto.update_by,
          update_date: new Date(),
        }),
      );
    }

    const dispatch_id = head.dispatch_id;
    const rows: any[] = await manager.query(
      `
        SELECT * FROM (
          SELECT
            OT.EMPNO,
            CASE
                WHEN CAD.BUSLINENO IS NOT NULL THEN CAD.BUSLINENO
                ELSE LINE.BUSID
            END AS BUSID,
            CASE
                WHEN CAD.BUSLINENO IS NOT NULL THEN LINE_CAD.BUSNAME
                ELSE LINE.BUSNAME
            END AS BUSNAME,
            CASE
                WHEN CAD.BUSLINENO IS NOT NULL THEN LINE_CAD.BUSSEAT
                ELSE LINE.BUSSEAT
            END AS BUSSEAT,
            CASE
                WHEN CAD.BUSLINENO IS NOT NULL THEN LINE_CAD.BUSTYPE
                ELSE LINE.BUSTYPE
            END AS BUSTYPE,
            CASE
                WHEN CAD.BUSSTOPNO IS NOT NULL THEN CAD.BUSSTOPNO
                ELSE STOP.STOP_ID
            END AS STOP_ID,
            CASE
                WHEN CAD.BUSSTOPNO IS NOT NULL THEN STOP_CAD.STOP_NAME
                ELSE STOP.STOP_NAME
            END AS STOP_NAME,
            CASE
                WHEN CAD.BUSSTOPNO IS NOT NULL THEN STOP_CAD.WORKDAY_TIMEIN
                ELSE STOP.WORKDAY_TIMEIN
            END AS WORKDAY_TIMEIN,
            CASE
                WHEN CAD.BUSSTOPNO IS NOT NULL THEN STOP_CAD.NIGHT_TIMEIN
                ELSE STOP.NIGHT_TIMEIN
            END AS NIGHT_TIMEIN,
            CASE
                WHEN CAD.BUSSTOPNO IS NOT NULL THEN STOP_CAD.HOLIDAY_TIMEIN
                ELSE STOP.HOLIDAY_TIMEIN
            END AS HOLIDAY_TIMEIN,
            ROUTE.STATENO AS ROUTE_SEQ,
            CAD.BUSLINENO AS NEW_BUSLINENO,
            CAD.BUSSTOPNO AS NEW_BUSSTOPNO
        FROM WEBFORM.OTFORM OT
        INNER JOIN WEBFORM.FORM F
            ON F.NFRMNO = OT.NFRMNO
            AND F.VORGNO = OT.VORGNO
            AND F.CYEAR  = OT.CYEAR
            AND F.CYEAR2 = OT.CYEAR2
            AND F.NRUNNO = OT.NRUNNO
        JOIN GPREPORT.BUS_PASSENGER PSG
            ON PSG.EMPNO = OT.EMPNO
        JOIN GPREPORT.BUS_ROUTE ROUTE
            ON ROUTE.STOPNO = PSG.BUSSTOP
        JOIN GPREPORT.BUS_STOP STOP
            ON STOP.STOP_ID = PSG.BUSSTOP
        JOIN GPREPORT.BUS_LINE LINE
            ON LINE.BUSID = ROUTE.BUSLINE
        LEFT JOIN WEBFORM.CHANGEADDR CAD
            ON OT.WORKDATE = CAD.WORKDATE
          AND OT.EMPNO = CAD.EMPNO
        LEFT JOIN GPREPORT.BUS_LINE LINE_CAD
            ON LINE_CAD.BUSID = CAD.BUSLINENO
        LEFT JOIN GPREPORT.BUS_STOP STOP_CAD
            ON STOP_CAD.STOP_ID = CAD.BUSSTOPNO
        WHERE OT.WORKDATE = :1
          AND OT.TIMEIN >= :2
          AND OT.TIMEOUT <= :3
          AND F.CST <> '3'
      ) 
      `,
      [workDate, dto.timeout_from, dto.timeout_to],
    ); 

    if (!rows.length) {
      return {
        ok: true,
        message: 'NO_OT_ROWS',
        created: [
          {
            shift,
            dispatch_id,
            status: head.status,
            lines_added: 0,
            stops_added: 0,
            passengers_added: 0,
          },
        ],
      };
    }

    // 3) existing data in this dispatch
    const [existingLines, existingStops, existingPassengers] = await Promise.all([
      manager.find(BusDispatchLine, { where: { dispatch_id } }),
      manager.find(BusDispatchStop, { where: { dispatch_id } }),
      manager.find(BusDispatchPassenger, { where: { dispatch_id } }),
    ]);

    const lineSet = new Set(existingLines.map((l) => Number(l.busid)));
    const stopSet = new Set(
      existingStops.map((s) => `${Number(s.line_id)}|${Number(s.stop_id)}`),
    );
    const passEmpSet = new Set(
      existingPassengers.map((p) => String(p.empno || '').trim()).filter(Boolean),
    );

    // 4) filter source rows
    // - skip empno ที่มีอยู่แล้วใน dispatch นี้
    const sourceRows = rows.filter((r) => {
      const empno = String(r.EMPNO || '').trim();
      const busid = r.BUSID != null ? Number(r.BUSID) : null;
      const stop_id = r.STOP_ID != null ? Number(r.STOP_ID) : null;

      if (!empno || !busid || !stop_id) return false;
      if (passEmpSet.has(empno)) return false;
      return true;
    });

    if (!sourceRows.length) {
      return {
        ok: true,
        message: 'NO_NEW_ROWS',
        created: [
          {
            shift,
            dispatch_id,
            status: head.status,
            lines_added: 0,
            stops_added: 0,
            passengers_added: 0,
          },
        ],
      };
    }

    // 5) group source
    const busMap = new Map<
      number,
      {
        busid: number;
        busname: string | null;
        busseat: number | null;
        bustype: string | null;
        stops: Map<
          number,
          {
            stop_id: number;
            stop_name: string | null;
            plan_time: string | null;
            route_seq: number;
          }
        >;
      }
    >();

    const empSourceMap = new Map<string, { busid: number; stop_id: number }>();

    for (const r of sourceRows) {
      const busid = Number(r.BUSID);
      const stop_id = Number(r.STOP_ID);
      const empno = String(r.EMPNO || '').trim();

      if (!busMap.has(busid)) {
        busMap.set(busid, {
          busid,
          busname: r.BUSNAME ?? null,
          busseat: r.BUSSEAT != null ? Number(r.BUSSEAT) : null,
          bustype: r.BUSTYPE ?? null,
          stops: new Map(),
        });
      }

      const bus = busMap.get(busid)!;

      if (!bus.stops.has(stop_id)) {
        bus.stops.set(stop_id, {
          stop_id,
          stop_name: r.STOP_NAME ?? null,
          plan_time: this.pickPlanTime(shift, r),
          route_seq: r.ROUTE_SEQ != null ? Number(r.ROUTE_SEQ) : 9999,
        });
      }

      if (!empSourceMap.has(empno)) {
        empSourceMap.set(empno, { busid, stop_id });
      }
    }

    const buses = Array.from(busMap.values()).sort((a, b) => {
      const an = String(a.busname ?? '').toLowerCase();
      const bn = String(b.busname ?? '').toLowerCase();
      return an && bn ? an.localeCompare(bn) : a.busid - b.busid;
    });

    // 6) insert missing lines
    const linesToInsert = buses
      .filter((b) => !lineSet.has(b.busid))
      .map((b) =>
        manager.create(BusDispatchLine, {
          dispatch_id,
          busid: b.busid,
          busname: b.busname,
          bustype: b.bustype,
          busseat: b.busseat,
          line_status: '1',
        }),
      );

    if (linesToInsert.length) {
      await manager.save(BusDispatchLine, linesToInsert);
      for (const l of linesToInsert) lineSet.add(Number(l.busid));
    }

    // 7) insert missing stops
    const stopsToInsert: BusDispatchStop[] = [];

    for (const b of buses) {
      const stopsSorted = Array.from(b.stops.values()).sort((x, y) => {
        if (x.route_seq !== y.route_seq) return x.route_seq - y.route_seq;
        return x.stop_id - y.stop_id;
      });

      for (const s of stopsSorted) {
        const key = `${b.busid}|${s.stop_id}`;
        if (stopSet.has(key)) continue;

        stopsToInsert.push(
          manager.create(BusDispatchStop, {
            dispatch_id,
            line_id: b.busid,
            stop_id: s.stop_id,
            stop_name: s.stop_name,
            plan_time: s.plan_time,
          }),
        );

        stopSet.add(key);
      }
    }

    if (stopsToInsert.length) {
      await manager.save(BusDispatchStop, stopsToInsert);
    }

    // 8) insert missing passengers
    const passengersToInsert: BusDispatchPassenger[] = [];

    for (const [empno, src] of empSourceMap.entries()) {
      if (passEmpSet.has(empno)) continue;

      passengersToInsert.push(
        manager.create(BusDispatchPassenger, {
          dispatch_id,
          stop_id: src.stop_id,
          empno,
          status: 'E',
        }),
      );

      passEmpSet.add(empno);
    }

    if (passengersToInsert.length) {
      await manager.save(BusDispatchPassenger, passengersToInsert);
    }

    return {
      ok: true,
      created: [
        {
          shift,
          dispatch_id,
          status: head.status,
          lines_added: linesToInsert.length,
          stops_added: stopsToInsert.length,
          passengers_added: passengersToInsert.length,
        },
      ],
    };
  });
}
// ==================================================== //

  async getDispatch(dto: DispatchKeyDto) {
    const head = await this.headRepo.findOne({
      where: {
        dispatch_date: dto.workdate,
        dispatch_type: dto.dispatch_type,
        shift: dto.shift,
      } as any,
    });

    if (!head) {
      return {
        dispatch_id: null,
        workdate: dto.workdate,
        dispatch_type: dto.dispatch_type,
        shift: dto.shift,
        status: 'D',
        update_by: null,
        update_date: null,
        lines: [],
      };
    }

    const dispatch_id = head.dispatch_id;
    const [lines, stops, passengers] = await Promise.all([
      this.lineRepo.find({
        where: {
          dispatch_id,
          //line_status: '1',
        } as any,
        order: { busid: 'ASC' as any },
      }),

      this.stopRepo.find({
        where: { dispatch_id } as any,
        order: { line_id: 'ASC' as any, stop_id: 'ASC' as any },
      }),

      this.dataSource.query(
        `
        SELECT
          P.STOP_ID AS stop_id, H.STATUS AS status,
          P.EMPNO AS empno,
          U.SNAME AS engname,
          U.STNAME AS thainame,
          U.SSEC AS ssec,
          U.SDEPT AS sdept,
          U.SDIV AS sdiv
        FROM GPREPORT.BUS_DISPATCH_PASSENGER P
        INNER JOIN GPREPORT.BUS_DISPATCH_HEAD H
          ON H.DISPATCH_ID = P.DISPATCH_ID
        LEFT JOIN AMEC.AMECUSERALL U
          ON U.SEMPNO = P.EMPNO
        WHERE P.DISPATCH_ID = :1
          AND P.STATUS = :2
        ORDER BY P.STOP_ID ASC, P.EMPNO ASC
        `,
        [dispatch_id, 'E'],
      ),
    ]);

    const passByStopId = new Map<number, any[]>();
    for (const p of passengers) {
      const stopId = Number(p.STOP_ID ?? p.stop_id);
      if (!passByStopId.has(stopId)) {
        passByStopId.set(stopId, []);
      }

      passByStopId.get(stopId)!.push({
        empno: String(p.EMPNO ?? p.empno ?? '').trim(),
        engname: p.ENGNAME ?? p.engname ?? null,
        thainame: p.THAINAME ?? p.thainame ?? null,
        ssec: p.SSEC ?? p.ssec ?? null,
        sdept: p.SDEPT ?? p.sdept ?? null,
        sdiv: p.SDIV ?? p.sdiv ?? null,
      });
    }

    const stopsByLineId = new Map<number, any[]>();
    for (const s of stops) {
      const lineId = Number((s as any).line_id);
      const stopId = Number((s as any).stop_id);
      const stopPassengers = passByStopId.get(stopId) || [];
      const stopOut = {
        dispatch_id,
        line_id: lineId,
        stop_id: stopId,
        stop_name: (s as any).stop_name,
        plan_time: (s as any).plan_time,
        passenger_count: stopPassengers.length,
        passengers: stopPassengers,
      };

      if (!stopsByLineId.has(lineId)) {
        stopsByLineId.set(lineId, []);
      }

      stopsByLineId.get(lineId)!.push(stopOut);
    }

    const linesOut = lines.map((l) => {
      const busid = Number((l as any).busid);
      const lineStops = stopsByLineId.get(busid) || [];
      const passenger_count = lineStops.reduce((sum, stop) => {
        return sum + (stop.passengers?.length || 0);
      }, 0);

      return {
        dispatch_id,
        line_id: busid,
        busid,
        busname: (l as any).busname,
        bustype: (l as any).bustype,
        busseat: (l as any).busseat,
        line_status: (l as any).line_status,
        passenger_count,
        stops: lineStops,
      };
    });

    return {
      dispatch_id,
      workdate: dto.workdate,
      dispatch_type: head.dispatch_type,
      shift: head.shift,
      status: head.status,
      update_by: head.update_by,
      update_date: head.update_date,
      lines: linesOut,
    };
  }
  

  async moveStop(dto: MoveStopDto) {
    return this.dataSource.transaction(async (manager) => {
      const dispatch_id = Number(dto.dispatch_id);
      const stop_id = Number(dto.stop_id);
      const head = await manager.findOne(BusDispatchHead, {  where: { dispatch_id },  });

      if (!head) throw new Error('DISPATCH_NOT_FOUND');
      if (head.status === 'C') throw new Error('DISPATCH_CLOSED');

      const stop = await manager.findOne(BusDispatchStop, { where: { dispatch_id, stop_id },});

      if (!stop) throw new Error('STOP_NOT_FOUND');
      // ---------- move line ----------
      if (dto.target_line_id !== undefined) {
        const target_line_id = Number(dto.target_line_id);
        const targetLine = await manager.findOne(BusDispatchLine, { where: { dispatch_id, busid: target_line_id }, });
        if (!targetLine) throw new Error('TARGET_LINE_NOT_FOUND');
        stop.line_id = target_line_id;
      }

      // ---------- update stop name ----------
      if (dto.stop_name !== undefined) {  stop.stop_name = String(dto.stop_name).trim(); }

      // ---------- update plan time ----------
      if (dto.plan_time !== undefined) {  stop.plan_time = dto.plan_time; }
      await manager.save(BusDispatchStop, stop);

      head.update_by = dto.update_by;
      head.update_date = new Date();
      await manager.save(BusDispatchHead, head);

      return {
        ok: true,
        dispatch_id,
        stop_id,
        line_id: stop.line_id,
        stop_name: stop.stop_name,
        plan_time: stop.plan_time,
      };
    });
  }

  async disablePassenger(dto: { dispatch_id: number; empno: string; update_by: string }) {
    return this.dataSource.transaction(async (manager) => {
      const dispatch_id = Number(dto.dispatch_id);
      const empno = String(dto.empno).trim();

      const head = await manager.findOne(BusDispatchHead, {
        where: { dispatch_id },
      });
      if (!head) throw new Error('DISPATCH_NOT_FOUND');
      if (head.status === 'C') throw new Error('DISPATCH_CLOSED');

      const passenger = await manager.findOne(BusDispatchPassenger, {
        where: { dispatch_id, empno } as any,
      });
      if (!passenger) throw new Error('PASSENGER_NOT_FOUND');

      passenger.status = 'D';
      await manager.save(BusDispatchPassenger, passenger);

      head.update_by = dto.update_by;
      head.update_date = new Date();
      await manager.save(BusDispatchHead, head);

      return { ok: true, dispatch_id, empno, status: 'D' };
    });
  }

  async upsertPassenger(dto: { dispatch_id: number; stop_id: number; empno: string; update_by: string }) {
    return this.dataSource.transaction(async (manager) => {
      const dispatch_id = Number(dto.dispatch_id);
      const stop_id = Number(dto.stop_id);
      const empno = String(dto.empno || '').trim();
      if (!dispatch_id) throw new Error('DISPATCH_ID_REQUIRED');
      if (!stop_id) throw new Error('STOP_ID_REQUIRED');
      if (!empno) throw new Error('EMPNO_REQUIRED');

      const head = await manager.findOne(BusDispatchHead, { where: { dispatch_id }, });
      if (!head) throw new Error('DISPATCH_NOT_FOUND');
      if (head.status === 'C') throw new Error('DISPATCH_CLOSED');

      const stop = await manager.findOne(BusDispatchStop, { where: { dispatch_id, stop_id } as any,});
      if (!stop) throw new Error('STOP_NOT_FOUND');
      const empRows: any[] = await manager.query( ` SELECT U.SEMPNO, U.STNAME, U.CSTATUS FROM AMEC.AMECUSERALL U WHERE U.SEMPNO = :1`,[empno],);
      if (!empRows.length) throw new Error('EMPLOYEE_NOT_FOUND');

      let passenger = await manager.findOne(BusDispatchPassenger, {
        where: { dispatch_id, empno } as any,
      });

      if (passenger) {
        passenger.stop_id = stop_id;
        passenger.status = 'E';
        await manager.save(BusDispatchPassenger, passenger);
      } else {
        passenger = manager.create(BusDispatchPassenger, {
          dispatch_id,
          stop_id,
          empno,
          status: 'E',
        });
        await manager.save(BusDispatchPassenger, passenger);
      }

      head.update_by = dto.update_by;
      head.update_date = new Date();
      await manager.save(BusDispatchHead, head);

      return {
        ok: true,
        dispatch_id,
        stop_id,
        empno,
        status: 'E',
      };
    });
  }

  async updateLinedispatchStatus(dto: UpdateLineStatusDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const dispatchId = Number(dto.dispatch_id);
      const busid = Number(dto.busid);
      const updateBy = String(dto.update_by);
      const lineStatus = String(dto.status) as '0' | '1';
      const passengerStatus = lineStatus === '0' ? 'D' : 'E';

      const lineRepo = queryRunner.manager.getRepository(BusDispatchLine);
      const stopRepo = queryRunner.manager.getRepository(BusDispatchStop);
      const passengerRepo = queryRunner.manager.getRepository(BusDispatchPassenger);

      const line = await lineRepo.findOne({
        where: {
          dispatch_id: dispatchId,
          busid: busid,
        },
      });

      if (!line) {
        throw new Error('ไม่พบข้อมูลสายรถที่ต้องการแก้ไขสถานะ');
      }

      await lineRepo.update(
        {
          dispatch_id: dispatchId,
          busid: busid,
        },
        {
          line_status: lineStatus,
        },
      );

      const stops = await stopRepo.find({
        where: {
          dispatch_id: dispatchId,
          line_id: busid,
        },
        select: ['stop_id'],
      });

      const stopIds = stops.map((item) => item.stop_id).filter(Boolean);

      if (stopIds.length > 0) {
        await passengerRepo.update(
          {
            dispatch_id: dispatchId,
            stop_id: In(stopIds),
          },
          {
            status: passengerStatus,
          },
        );
      }

      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        message: lineStatus === '0' ? 'ซ่อนสายรถสำเร็จ' : 'กู้กลับสายรถสำเร็จ',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


  async saveAddPassenger(dto: SaveAddPassengerDto) {
    return await this.dataSource.transaction(async (manager) => {
      const dispatchId = Number(dto.dispatch_id);
      const busid = Number(dto.line.busid);
      const stopId = Number(dto.stop.stop_id);
      const empno = String(dto.passenger.empno);
      const updateBy = String(dto.update_by);

      const lineRepo = manager.getRepository(BusDispatchLine);
      const stopRepo = manager.getRepository(BusDispatchStop);
      const passengerRepo = manager.getRepository(BusDispatchPassenger);

      // 1) ตรวจสอบ passenger ก่อน
      const existsPassenger = await passengerRepo.findOne({
        where: {
          dispatch_id: dispatchId,
          empno: empno,
        },
      });

      if (existsPassenger && existsPassenger.status === 'E') {
        return {
          status: false,
          message: 'มีการจัดรถให้พนักงานนี้แล้ว',
        };
      }

      // 2) ตรวจสอบ line
      const existsLine = await lineRepo.findOne({
        where: {
          dispatch_id: dispatchId,
          busid: busid,
        },
      });

      if (!existsLine) {
        await lineRepo.save(
          lineRepo.create({
            dispatch_id: dispatchId,
            busid: busid,
            busname: dto.line.busname || null,
            bustype: dto.line.bustype || null,
            busseat: dto.line.busseat ?? null,
            line_status: '1',
          }),
        );
      } else {
        await lineRepo.update(
          {
            dispatch_id: dispatchId,
            busid: busid,
          },
          {
            line_status: '1',
            busname: dto.line.busname || existsLine.busname || null,
            bustype: dto.line.bustype || existsLine.bustype || null,
            busseat: dto.line.busseat ?? existsLine.busseat ?? null,
          },
        );
      }

      // 3) ตรวจสอบ stop
      const existsStop = await stopRepo.findOne({
        where: {
          dispatch_id: dispatchId,
          stop_id: stopId,
        },
      });

      if (!existsStop) {
        await stopRepo.save(
          stopRepo.create({
            dispatch_id: dispatchId,
            line_id: busid, // value = BUSID
            stop_id: stopId,
            stop_name: dto.stop.stop_name || null,
            plan_time: dto.stop.plan_time || null,
          }),
        );
      }

      // 4) insert / update passenger
      if (!existsPassenger) {
        await passengerRepo.save(
          passengerRepo.create({
            dispatch_id: dispatchId,
            stop_id: stopId,
            empno: empno,
            status: 'E',
          }),
        );
      } else if (existsPassenger.status === 'D') {
        await passengerRepo.update(
          {
            dispatch_id: dispatchId,
            empno: empno,
          },
          {
            stop_id: stopId,
            status: 'E',
          },
        );
      }

      return {
        status: true,
        message: 'บันทึกข้อมูลผู้โดยสารสำเร็จ',
      };
    });
  }


  //================================== รายงาน ==================================//
  async getReportBus(dto: DailyDispatchReportDto) {
    const dispatchId = Number(dto.dispatch_id);

    // 1) ดึง line
    const lines = await this.dataSource
      .getRepository(BusDispatchLine)
      .createQueryBuilder('l')
      .where('l.dispatch_id = :dispatchId', { dispatchId })
      .andWhere("NVL(l.line_status, '1') = '1'")
      .orderBy('l.busid', 'ASC')
      .getMany();

    // 2) ดึง stop
    const stops = await this.dataSource
      .getRepository(BusDispatchStop)
      .createQueryBuilder('s')
      .where('s.dispatch_id = :dispatchId', { dispatchId })
      .orderBy('s.line_id', 'ASC')
      .addOrderBy('s.plan_time', 'DESC')
      .addOrderBy('s.stop_id', 'ASC')
      .getMany();

    // 3) ดึง passenger ที่ enable + join employee
    const passengers = await this.dataSource
      .getRepository(BusDispatchPassenger)
      .createQueryBuilder('p')
      .leftJoin(
        'AMECUSERALL',
        'u',
        "TRIM(TO_CHAR(u.SEMPNO)) = TRIM(TO_CHAR(p.empno))",
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

    // 4) ประกอบ report
    const resultLines = lines.map((line) => {
      const lineStops = stops
        .filter((s) => s.line_id === line.busid)
        .map((stop) => {
          const stopPassengers = passengers
            .filter((p) => Number(p.stop_id) === Number(stop.stop_id))
            .map((p, index) => {
              return {
                no: index + 1,
                empno: p.empno || '',
                fullname: p.fullname || '',
                dept: p.dept || '',
                sec: p.sec || '',
                div: p.div || '',
              };
            });

          return {
            stop_id: stop.stop_id,
            stop_name: stop.stop_name || '',
            plan_time: stop.plan_time || '',
            passengers: stopPassengers,
          };
        });

      return {
        busid: line.busid,
        busname: line.busname || '',
        bustype: line.bustype || '',
        busseat: line.busseat,
        line_status: line.line_status || '',
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
//================================================================== //
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
        "TRIM(TO_CHAR(u.SEMPNO)) = TRIM(TO_CHAR(p.empno))",
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

    return {
      status: true,
      dispatch_id: dispatchId,
      title: 'รายชื่อผู้ที่ไม่ได้จัดรถ',
      rows,
      message: 'ok',
    };
  }
  
  private async buildDispatchReportTitle(dispatchId: number) {
    const head = await this.dataSource
      .getRepository(BusDispatchHead)
      .createQueryBuilder('h')
      .where('h.dispatch_id = :dispatchId', { dispatchId })
      .getOne();

    if (!head) return 'ตารางรถรับส่งพนักงาน';

    const date = head.dispatch_date
      ? new Date(head.dispatch_date).toLocaleDateString('th-TH')
      : '';

    let timeText = '';
    if (head.dispatch_type === 'O' && head.shift === 'D') timeText = 'OT เวลา 19.30 น.';
    else if (head.dispatch_type === 'O' && head.shift === 'S') timeText = 'OT เวลา 21.30 น.';
    else if (head.dispatch_type === 'O' && head.shift === 'N') timeText = 'OT (กะกลางคืน) เวลา 07.30 น.';
    else if (head.shift === 'H') timeText = 'OT เวลา 17.00 น.';

    return `ตารางรถรับส่งพนักงาน ${timeText} ประจำวันที่ ${date}`;
  }


  async updatePassengerStatus(dto: UpdatePassengerStatusDto) {
    return this.dataSource.transaction(async (manager) => {
      const dispatch_id = Number(dto.dispatch_id);
      const empno = String(dto.empno).trim();
      const status = String(dto.status).trim();
      const head = await manager.findOne(BusDispatchHead, {
        where: { dispatch_id },
      });

      if (!head) throw new Error('DISPATCH_NOT_FOUND');
      if (head.status === 'C') throw new Error('DISPATCH_CLOSED');

      const passenger = await manager.findOne(BusDispatchPassenger, {
        where: { dispatch_id, empno } as any,
      });

      if (!passenger) throw new Error('PASSENGER_NOT_FOUND');

      passenger.status = status;
      await manager.save(BusDispatchPassenger, passenger);

      head.update_by = dto.update_by;
      head.update_date = new Date();
      await manager.save(BusDispatchHead, head);

      return {
        ok: true,
        dispatch_id,
        empno,
        status,
      };
    });
  }

  async updateLineType(dto: UpdateLineTypeDto) {
    const dispatchId = Number(dto.dispatch_id);
    const busId = Number(dto.busid);
    const repo = this.dataSource.getRepository(BusDispatchLine);
    const line = await repo.findOne({
      where: {
        dispatch_id: dispatchId,
        busid: busId,
      },
    });

    if (!line) {
      return {
        status: false,
        message: 'ไม่พบข้อมูลสายรถที่ต้องการแก้ไข',
      };
    }

    line.bustype = dto.bustype;
    line.busseat = Number(dto.busseat);
    await repo.save(line);
    return {
      status: true,
      message: 'แก้ไขประเภทรถสำเร็จ',
    };
  }

  async runDailySchedule(dto: RunDailyScheduleDto) {
    const runDate = dayjs().format('YYYY-MM-DD');
    const updateBy = dto.update_by;

    const today = dayjs(runDate);
    const tomorrow = today.add(1, 'day');

    const jobs : BuildDailyFirstDto[]  = [
      {
        workdate: today.startOf('day').toDate(),
        dispatch_type: 'O',
        timeout_from: '1730',
        timeout_to: '1930',
        update_by: updateBy,
        shift: 'D',
      },
      {
        workdate: today.startOf('day').toDate(),
        dispatch_type: 'O',
        timeout_from: '1730',
        timeout_to: '2130',
        update_by: updateBy,
        shift: 'D',
      },
      {
        workdate: tomorrow.startOf('day').toDate(),
        dispatch_type: 'O',
        timeout_from: '0530',
        timeout_to: '0730',
        update_by: updateBy,
        shift: 'D',
      },
    ];

    for (const job of jobs) {
      await this.buildDailyFirst(job);
    }

    const isHoliday = await this.checkHoliday(tomorrow.format('YYYYMMDD'));

    if (isHoliday) {
      await this.buildDailyFirst({
        workdate: tomorrow.startOf('day').toDate(),
        dispatch_type: 'O',
        timeout_from: '0800',
        timeout_to: '1700',
        update_by: updateBy,
        shift: 'D',
      });
    }

    return {
      status: true,
      message: 'Run daily schedule completed',
    };
  }

  async checkHoliday(holidayDate: string): Promise<boolean> {
    const rows = await this.dataSource.query(
      `SELECT HOLIDAY
        FROM WEBFORM.HOLIDAY
        WHERE HOLIDAY = :1`,
      [holidayDate],
    );
    return Array.isArray(rows) && rows.length > 0;
  }


  async createShareFolder() {
    try {
      const basePath = '\\\\amecnas\\FileServer\\Public\\golf\\TEST';
      //const basePath = '\\\\amecnas\\FileServer\\GP_Div\\Electronic_Data\\Xerox_in\\0.2 GA\\Bus_report';

      const now = new Date();
      const year = now.getFullYear().toString();
      const month = String(now.getMonth() + 1).padStart(2, '0');

      const yearPath = path.join(basePath, year);
      const monthPath = path.join(yearPath, month);

      await fs.mkdir(yearPath, { recursive: true });
      await fs.mkdir(monthPath, { recursive: true });

      const testFile = path.join(monthPath, 'test.txt');
      await fs.writeFile(testFile, `test at ${new Date().toISOString()}`);

      return {
        status: true,
        message: 'Create folder success',
        folderPath: monthPath,   // << เพิ่มตัวนี้
        base_path: basePath,
        year_path: yearPath,
        month_path: monthPath,
        test_file: testFile,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err?.message || 'Create folder failed',
        folderPath: undefined,   // << ใส่ให้ shape ตรงกัน
      };
    }
  }

  async exportAndSendMail(dto: ExportAndSendMailDto) {
      const dispatchId = Number(dto.dispatch_id);
      if (!dispatchId) {
        throw new Error('dispatch_id ไม่ถูกต้อง');
      }

      const reportDto: DailyDispatchReportDto = {
        dispatch_id: String(dispatchId),
      };

      const reportBusRes = await this.getReportBus(reportDto);
      if (!reportBusRes?.status) {
        throw new Error(reportBusRes?.message || 'ไม่สามารถดึงข้อมูลรายงานจัดรถได้');
      }

      const reportDisabledRes = await this.getReportDisabledPassenger(reportDto);
      if (!reportDisabledRes?.status) {
        throw new Error(reportDisabledRes?.message || 'ไม่สามารถดึงข้อมูลรายงานผู้ไม่ได้จัดรถได้');
      }

      const folderRes = await this.createShareFolder();
      if (!folderRes?.status || !folderRes?.folderPath) {
        throw new Error(folderRes?.message || 'ไม่สามารถสร้างโฟลเดอร์กลางได้');
      }

      const folderPath = folderRes.folderPath;

      const workbook1 = await this.buildBusDailyLayoutWorkbook(reportBusRes);
      const workbook2 = await this.buildDisabledPassengerWorkbook(reportDisabledRes, dto);

      const timeStamp = dayjs().format('YYYYMMDD_HHmmss');
      const fileName1 = `OT_Daily_Transportation_Route_${timeStamp}.xlsx`;
      const fileName2 = `List_of_Employee_unable_arrange_transportation_${timeStamp}.xlsx`;

      const filePath1 = path.join(folderPath, fileName1);
      const filePath2 = path.join(folderPath, fileName2);

      await workbook1.xlsx.writeFile(filePath1);
      await workbook2.xlsx.writeFile(filePath2);

      await this.sendDispatchMail({
        to: dto.mail_to || 'supamid@mitsubishielevatorasia.co.th',
        cc: dto.mail_cc || '',
        bcc: dto.mail_bcc || '',
        subject: `แจ้งแผนการจัดรถพนักงาน (${dto.workdate})`,
        html: this.buildDispatchMailHtml(dto),
        attachments: [filePath1, filePath2],
      });

      const updateDto: SaveDispatchDto = {
        dispatch_id: dispatchId,
        status: 'F',
        update_by: dto.update_by,
      };

      const updateRes = await this.updateDispatchStatusHead(updateDto);
      if (!updateRes?.status) {
        throw new Error(updateRes?.message || 'ส่งอีเมลสำเร็จ แต่ไม่สามารถอัปเดตสถานะแผนการจัดรถได้');
      }

      return {
        status: true,
        message: 'สร้างไฟล์ Excel และส่งอีเมลสำเร็จ',
        folderPath,
        files: [
          { fileName: fileName1, filePath: filePath1 },
          { fileName: fileName2, filePath: filePath2 },
        ],
      };
  }
  

  private getMailTransporter() {
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT || 25),
      secure: false,
      auth: process.env.MAIL_USER
        ? {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          }
        : undefined,
    });
  }

  private async sendDispatchMail(params: {
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    html: string;
    attachments: string[];
  }) {
    const transporter = this.getMailTransporter();
    await transporter.sendMail({
      from: 'noreply@mitsubishielevatorasia.co.th',
      to: params.to,
      cc: params.cc,
      bcc: params.bcc,
      subject: params.subject,
      html: params.html,
      attachments: params.attachments.map((filePath) => ({
        filename: path.basename(filePath),
        path: filePath,
      })),
    });

    return { status: true };
  }

  private buildDispatchMailHtml(dto: ExportAndSendMailDto) {
    let displayTime = '-';
    if (dto.dispatch_type === 'OT') displayTime = '17.30 น.';
    else if (dto.dispatch_type === 'OT_SPECIAL') displayTime = '21.30 น.';
    else if (dto.dispatch_type === 'NIGHT') displayTime = '07.30 น.';
    else if (dto.dispatch_type === 'HOLIDAY') displayTime = '17.00 น.';

    return `
      <p>เรียน ผู้จัดการ, ซุปเปอร์ไวเซอร์, โฟร์แมน และ AMEC PC USER</p>
      <br>
      <p>ทาง GA ขอแจ้งตารางรถรับส่งพนักงาน OT เวลา ${displayTime} ประจำวันที่ ${dto.display_date_text || dto.workdate || '-'} </p>
      <p>ตามไฟล์แนบดังนี้</p>
      <ul>
        <li>OT Daily Transportation Route</li>
        <li>List of Employee unable arrange transportation </li>
      </ul>
      <br>
      <p>จึงแจ้งมาเพื่อทราบ</p>
      <p>Best regards</p>
      <p>GA Department</p>
    `;
  }
  
  private border() {
    return {
      top: { style: 'thin' as const },
      left: { style: 'thin' as const },
      bottom: { style: 'thin' as const },
      right: { style: 'thin' as const },
    };
  }

  private alignment(horizontal: 'left' | 'center' | 'right', vertical: 'top' | 'middle' | 'bottom') {
    return {
      horizontal,
      vertical,
      wrapText: true,
    } as Partial<ExcelJS.Alignment>;
  }

  private mergeCell(
    sheet: ExcelJS.Worksheet,
    rowStart: number,
    colStart: number,
    rowEnd: number,
    colEnd: number,
  ) {
    sheet.mergeCells(rowStart, colStart, rowEnd, colEnd);
  }

  private applyStyleToRange(
    sheet: ExcelJS.Worksheet,
    colStart: number,
    colEnd: number,
    row: number,
    style: {
      font?: Partial<ExcelJS.Font>;
      alignment?: Partial<ExcelJS.Alignment>;
      border?: Partial<ExcelJS.Borders>;
      fill?: ExcelJS.Fill;
    } = {},
  ) {
    for (let c = colStart; c <= colEnd; c++) {
      const cell = sheet.getRow(row).getCell(c);
      if (style.font) cell.font = style.font;
      if (style.alignment) cell.alignment = style.alignment;
      if (style.border) cell.border = style.border;
      if (style.fill) cell.fill = style.fill;
    }
  }

  private async buildBusDailyLayoutWorkbook(reportRes: any) {
    const lines = Array.isArray(reportRes.lines) ? reportRes.lines : [];
    if (!lines.length) {
      throw new Error('ไม่พบข้อมูลรายชื่อผู้ที่จัดรถ');
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Bus Daily Layout');

    const BLOCKS_PER_ROW = 5;
    const BLOCK_WIDTH = 4;
    const BLOCK_GAP = 0;
    const TOTAL_BLOCK_WIDTH = BLOCK_WIDTH + BLOCK_GAP;

    const validLines = lines.filter((line) => {
      const busId = String(line.busid || '').trim();
      if (busId === '30') return false;

      const stops = Array.isArray(line.stops) ? line.stops : [];
      return stops.some((stop) => Array.isArray(stop.passengers) && stop.passengers.length > 0);
    });

    if (!validLines.length) {
      throw new Error('ไม่พบข้อมูลรายชื่อผู้ที่จัดรถ');
    }

    const getBlockStartCol = (blockIndex: number) => 1 + blockIndex * TOTAL_BLOCK_WIDTH;
    const setCell = (row: number, col: number, value: any) => {
      sheet.getRow(row).getCell(col).value = value;
    };

    const styleCell = (
      row: number,
      col: number,
      opts: {
        font?: Partial<ExcelJS.Font>;
        alignment?: Partial<ExcelJS.Alignment>;
        border?: Partial<ExcelJS.Borders>;
        fill?: ExcelJS.Fill;
      } = {},
    ) => {
      const cell = sheet.getRow(row).getCell(col);
      if (opts.font) cell.font = opts.font;
      if (opts.alignment) cell.alignment = opts.alignment;
      if (opts.border) cell.border = opts.border;
      if (opts.fill) cell.fill = opts.fill;
    };

    const applyBorderRange = (rowStart: number, rowEnd: number, colStart: number, colEnd: number) => {
      for (let r = rowStart; r <= rowEnd; r++) {
        for (let c = colStart; c <= colEnd; c++) {
          styleCell(r, c, { border: this.border() });
        }
      }
    };

    const mergeAndSet = (
      row: number,
      colStart: number,
      colEnd: number,
      value: any,
      style: {
        font?: Partial<ExcelJS.Font>;
        alignment?: Partial<ExcelJS.Alignment>;
        border?: Partial<ExcelJS.Borders>;
        fill?: ExcelJS.Fill;
      } = {},
    ) => {
      this.mergeCell(sheet, row, colStart, row, colEnd);
      setCell(row, colStart, value);
      for (let c = colStart; c <= colEnd; c++) {
        styleCell(row, c, style);
      }
    };

    const getLineBlockRows = (line: any) => {
      const stops = Array.isArray(line.stops) ? line.stops : [];
      let count = 3;

      stops.forEach((stop) => {
        const passengers = Array.isArray(stop.passengers) ? stop.passengers : [];
        if (!passengers.length) return;
        count += passengers.length;
      });

      return count;
    };

    const writeLineBlock = (startRow: number, startCol: number, line: any) => {
      const col1 = startCol;
      const col2 = startCol + 1;
      const col3 = startCol + 2;
      const col4 = startCol + 3;

      const stops = Array.isArray(line.stops) ? line.stops : [];
      let currentRow = startRow;
      let runningNo = 1;

      const busTypeText =
        String(line.bustype) === '1' ? 'Bus' :
        String(line.bustype) === '2' ? 'Van' : '';

      const lineName = `${line.busname || line.busid || '-'}${busTypeText ? ` (${busTypeText})` : ''}`;

      mergeAndSet(currentRow, col1, col4, lineName, {
        font: { bold: true, size: 11 },
        alignment: this.alignment('center', 'middle'),
        border: this.border(),
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFF2CC' },
        },
      });
      sheet.getRow(currentRow).height = 20;
      currentRow++;

      setCell(currentRow, col1, 'จุดลงรถ');
      setCell(currentRow, col2, 'No.');
      setCell(currentRow, col3, 'รายชื่อ');
      setCell(currentRow, col4, 'แผนก');

      for (let c = col1; c <= col4; c++) {
        styleCell(currentRow, c, {
          font: { bold: true, size: 10 },
          alignment: this.alignment('center', 'middle'),
          border: this.border(),
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8F8F8' },
          },
        });
      }

      sheet.getRow(currentRow).height = 18;
      currentRow++;

      stops.forEach((stop) => {
        const passengers = Array.isArray(stop.passengers) ? stop.passengers : [];
        if (!passengers.length) return;

        const stopStartRow = currentRow;
        const stopEndRow = currentRow + passengers.length - 1;

        if (passengers.length > 1) {
          this.mergeCell(sheet, stopStartRow, col1, stopEndRow, col1);
        }

        setCell(stopStartRow, col1, stop.stop_name || '-');
        styleCell(stopStartRow, col1, {
          font: { size: 10 },
          alignment: {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true,
          },
          border: this.border(),
        });

        if (passengers.length > 1) {
          for (let r = stopStartRow; r <= stopEndRow; r++) {
            styleCell(r, col1, {
              border: this.border(),
              alignment: {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true,
              },
            });
          }
        }

        passengers.forEach((p, index) => {
          const rowNo = currentRow + index;
          setCell(rowNo, col2, runningNo++);
          setCell(rowNo, col3, p.fullname || '-');

          const sec = String(p.sec || '').trim().toUpperCase();
          const dept = String(p.dept || '').trim();
          let department = dept;
          if (sec && sec !== 'NO SECTION') {
            department = sec;
          }

          setCell(rowNo, col4, department || '-');

          styleCell(rowNo, col2, {
            font: { size: 10 },
            alignment: this.alignment('center', 'middle'),
            border: this.border(),
          });

          styleCell(rowNo, col3, {
            font: { size: 10 },
            alignment: {
              vertical: 'middle',
              horizontal: 'left',
              wrapText: true,
              indent: 1,
            },
            border: this.border(),
          });

          styleCell(rowNo, col4, {
            font: { size: 10 },
            alignment: this.alignment('center', 'middle'),
            border: this.border(),
          });

          sheet.getRow(rowNo).height = 18;
        });

        currentRow = stopEndRow + 1;
      });

      const endRow = currentRow - 1;
      applyBorderRange(startRow, endRow, col1, col4);

      return endRow;
    };

    const totalCols = BLOCKS_PER_ROW * TOTAL_BLOCK_WIDTH - BLOCK_GAP;
    this.mergeCell(sheet, 1, 1, 1, totalCols);
    setCell(1, 1, reportRes.title || 'ตารางรถรับส่งพนักงาน');

    this.applyStyleToRange(sheet, 1, totalCols, 1, {
      font: { bold: true, size: 14 },
      alignment: this.alignment('center', 'middle'),
    });

    sheet.getRow(1).height = 24;

    let rowCursor = 3;
    for (let i = 0; i < validLines.length; i += BLOCKS_PER_ROW) {
      const rowLines = validLines.slice(i, i + BLOCKS_PER_ROW);
      let maxBlockHeight = 0;

      rowLines.forEach((line) => {
        const h = getLineBlockRows(line);
        if (h > maxBlockHeight) maxBlockHeight = h;
      });

      rowLines.forEach((line, idx) => {
        const startCol = getBlockStartCol(idx);
        writeLineBlock(rowCursor, startCol, line);
      });

      rowCursor += maxBlockHeight + 2;
    }

    for (let i = 0; i < BLOCKS_PER_ROW; i++) {
      const startCol = getBlockStartCol(i);
      sheet.getColumn(startCol).width = 16;
      sheet.getColumn(startCol + 1).width = 6;
      sheet.getColumn(startCol + 2).width = 22;
      sheet.getColumn(startCol + 3).width = 12;
    }

    sheet.pageSetup = {
      paperSize: 9,
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: {
        left: 0.2,
        right: 0.2,
        top: 0.3,
        bottom: 0.3,
        header: 0.1,
        footer: 0.1,
      },
    };

    return workbook;
  }

  private async buildDisabledPassengerWorkbook(reportRes: any, dto: ExportAndSendMailDto) {
    const rows = Array.isArray(reportRes.rows) ? reportRes.rows : [];

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Disabled Passenger');

    sheet.insertRow(1, ['รายชื่อผู้ที่ไม่สามารถจัดรถรับส่งได้']);
    sheet.insertRow(2, [`ประจำวันที่ : ${dto.display_date_text || '-'}`]);
    sheet.insertRow(3, []);

    this.mergeCell(sheet, 1, 1, 1, 8);
    this.mergeCell(sheet, 2, 1, 2, 8);

    this.applyStyleToRange(sheet, 1, 8, 1, {
      font: { bold: true, size: 16 },
      alignment: this.alignment('center', 'middle'),
    });

    this.applyStyleToRange(sheet, 1, 8, 2, {
      font: { bold: true, size: 14 },
      alignment: this.alignment('center', 'middle'),
    });

    sheet.getRow(4).values = [
      'No',
      'รหัส',
      'ชื่อ-นามสกุล',
      'SEC',
      'DEPT',
      'DIV',
      'จุดรถ',
      'เวลากลับ',
    ];

    this.applyStyleToRange(sheet, 1, 8, 4, {
      font: { bold: true, size: 13 },
      alignment: this.alignment('center', 'middle'),
      border: this.border(),
    });

    rows.forEach((row, i) => {
      const rowNumber = i + 5;
      sheet.getRow(rowNumber).values = [
        row.no ?? i + 1,
        row.empno || '',
        row.fullname || '',
        row.sec || '',
        row.dept || '',
        row.div || '',
        row.stop_name || '',
        dto.display_time_text || '',
      ];
    });

    sheet.getColumn(1).width = 6;
    sheet.getColumn(2).width = 12;
    sheet.getColumn(3).width = 30;
    sheet.getColumn(4).width = 16;
    sheet.getColumn(5).width = 18;
    sheet.getColumn(6).width = 18;
    sheet.getColumn(7).width = 24;
    sheet.getColumn(8).width = 12;

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 4) {
        row.eachCell((cell, colNumber) => {
          cell.font = { ...(cell.font || {}), size: 12 };
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true,
          };

          if (colNumber === 3 && rowNumber >= 5) {
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'left',
              wrapText: true,
              indent: 1,
            };
          }

          cell.border = this.border();
        });
      }
    });
    return workbook;
  }

}