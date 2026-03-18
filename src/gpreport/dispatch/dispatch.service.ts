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
import { DeleteLineDto } from './dto/delete-line.dto';
import { SaveAddPassengerDto } from './dto/save-add-passenger.dto';
import { UpdateStatusDispatchDto } from './dto/update-status-dispatch.dto';
import { UpdatePassengerStatusDto } from './dto/update-passenger-status.dto';
import { AMECUUSERALL } from 'src/common/Entities/amec/views/AMECUUSERALL.entity';

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

  async saveDispatch(dto: SaveDispatchDto) {
    const head = await this.headRepo.findOne({
      where: { dispatch_id: dto.dispatch_id },
    });

    if (!head) throw new Error('DISPATCH_NOT_FOUND');
    if (head.status === 'C') throw new Error('DISPATCH_CLOSED');

    head.status = 'S';
    head.update_by = dto.update_by;
    head.update_date = new Date();

    await this.headRepo.save(head);
    return { dispatch_id: head.dispatch_id, status: head.status };
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
          line_status: '1',
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

  async deleteLinedispatch(dto: DeleteLineDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const dispatchId = Number(dto.dispatch_id);
      const busid = Number(dto.busid);
      const updateBy = String(dto.update_by);
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
        throw new Error("ไม่พบข้อมูลสายรถที่ต้องการลบ");
      }

      await lineRepo.update(
        {
          dispatch_id: dispatchId,
          busid: busid,
        },
        {
          line_status: "0",
        },
      );

      const stops = await stopRepo.find({
        where: {
          dispatch_id: dispatchId,
          line_id: busid,
        },
        select: ["stop_id"],
      });

      const stopIds = stops.map((item) => item.stop_id).filter(Boolean);
      if (stopIds.length > 0) {
        await passengerRepo.update(
          {
            dispatch_id: dispatchId,
            stop_id: In(stopIds),
          },
          {
            status: "D",
          },
        );
      }

      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        message: "ลบสายรถสำเร็จ",
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


}