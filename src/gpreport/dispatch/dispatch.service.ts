import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SaveDispatchDto } from './dto/save-dispatch.dto';
import { SaveOverwriteDto } from './dto/save-overwrite.dto';
import { BuildDailyFirstDto } from './dto/build-daily-first.dto';

import { BusDispatchHead } from './entities/bus_dispatch_head.entity';
import { BusDispatchLine } from './entities/bus_dispatch_line.entity';
import { BusDispatchStop } from './entities/bus_dispatch_stop.entity';
import { BusDispatchPassenger } from './entities/bus_dispatch_passenger.entity';
import { DispatchKeyDto } from './dto/dispatch-key.dto';
import { MoveStopDto } from './dto/move-stop.dto';

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

  private toOracleDateOnly(input: any): Date {
    if (input === null || input === undefined) {
      throw new Error('INVALID_DATE_FORMAT');
    }

    if (input instanceof Date && !isNaN(input.getTime())) {
      return new Date(input.getFullYear(), input.getMonth(), input.getDate());
    }

    const s = String(input).trim();

    const iso = new Date(s);
    if (!isNaN(iso.getTime())) {
      return new Date(iso.getFullYear(), iso.getMonth(), iso.getDate());
    }

    const m1 = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m1) {
      const y = Number(m1[1]);
      const m = Number(m1[2]);
      const d = Number(m1[3]);
      return new Date(y, m - 1, d);
    }

    const m2 = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m2) {
      const d = Number(m2[1]);
      const m = Number(m2[2]);
      const y = Number(m2[3]);
      return new Date(y, m - 1, d);
    }

    throw new Error(`INVALID_DATE_FORMAT:${s}`);
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

  private fmtMMDDYYYY(d: Date | null) {
    if (!d) return null;
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  private pickPlanTime(shift: string, r: any): string | null {
    if (shift === 'D') return r.WORKDAY_TIMEIN ? String(r.WORKDAY_TIMEIN).trim() : null;
    if (shift === 'N') return r.NIGHT_TIMEIN ? String(r.NIGHT_TIMEIN).trim() : null;
    if (shift === 'H') return r.HOLIDAY_TIMEIN ? String(r.HOLIDAY_TIMEIN).trim() : null;
    return null;
  }

  async buildDailyFirst(dto: BuildDailyFirstDto) {
    const workDate = this.toOracleDateOnly(dto.workdate);

    return this.dataSource.transaction(async (manager) => {
      const rows: any[] = await manager.query(
        `SELECT
          OT.WORKDATE, OT.TIMEIN, OT.TIMEOUT, OT.EMPNO,
          LINE.BUSID, LINE.BUSNAME, LINE.BUSSEAT, LINE.BUSTYPE, LINE.IS_CHONBURI,
          STOP.STOP_ID, STOP.STOP_NAME, STOP.WORKDAY_TIMEIN, STOP.NIGHT_TIMEIN, STOP.HOLIDAY_TIMEIN,
          ROUTE.STATENO AS ROUTE_SEQ
        FROM webform.OTFORM OT
        INNER JOIN GPREPORT.BUS_PASSENGER PSG ON PSG.EMPNO = OT.EMPNO
        INNER JOIN AMEC.AMECUSERALL USR ON USR.SEMPNO = PSG.EMPNO
        INNER JOIN GPREPORT.BUS_ROUTE ROUTE ON ROUTE.STOPNO = PSG.BUSSTOP
        INNER JOIN GPREPORT.BUS_STOP STOP ON STOP.STOP_ID = PSG.BUSSTOP
        INNER JOIN GPREPORT.BUS_LINE LINE ON LINE.BUSID = ROUTE.BUSLINE
        WHERE OT.WORKDATE = :1
          AND OT.TIMEOUT <= :2
          AND OT.TIMEOUT >= :3
        ORDER BY OT.EMPNO`,
        [
          workDate,
          dto.timeout_to,
          dto.timeout_from,
        ],
      );

      if (!rows.length) {
        return { ok: true, message: 'NO_OT_ROWS', created: [] };
      }

      const shift = dto.shift;
      const rowsShift = rows;
      const created: Array<any> = [];

      let head = await manager.findOne(BusDispatchHead, {
        where: {
          dispatch_date: workDate,
          dispatch_type: dto.dispatch_type,
          shift: shift,
        },
      });

      if (head) {
        created.push({
          shift,
          dispatch_id: head.dispatch_id,
          status: head.status,
          skipped: true,
        });
        return { ok: true, created };
      }

      head = manager.create(BusDispatchHead, {
        dispatch_date: workDate,
        dispatch_type: dto.dispatch_type,
        shift: shift,
        status: 'D',
        update_by: dto.update_by,
        update_date: new Date(),
      });
      head = await manager.save(head);

      const dispatch_id = head.dispatch_id;

      // 5) build LINE groups (distinct BUSID)
      const busMap = new Map<number, any>();

      for (const r of rowsShift) {
        const busid = Number(r.BUSID);
        if (!busMap.has(busid)) {
          busMap.set(busid, {
            busid,
            busname: r.BUSNAME ?? null,
            busseat:
              r.BUSSEAT !== null && r.BUSSEAT !== undefined
                ? Number(r.BUSSEAT)
                : null,
            bustype: r.BUSTYPE ?? null,
          });
        }
      }

      const buses = Array.from(busMap.values()).sort((a, b) => {
        const an = String(a.busname ?? '').toLowerCase();
        const bn = String(b.busname ?? '').toLowerCase();
        if (an && bn) return an.localeCompare(bn);
        return Number(a.busid) - Number(b.busid);
      });

      // เปลี่ยนจาก lineIdByBusId -> ใช้ busid ตรง ๆ
      const busIds = new Set<number>();

      for (const b of buses) {
        const line = manager.create(BusDispatchLine, {
          dispatch_id,
          busid: b.busid,
          busname: b.busname,
          bustype: b.bustype,
          busseat: b.busseat,
          line_status: '1',
        });

        await manager.save(line);
        busIds.add(b.busid);
      }

      // 6) build STOP groups per BUSID
      const stopKeyByBusStop = new Map<string, { stop_id: number; line_id: number }>();

      for (const busid of busIds.values()) {
        const stopMap = new Map<number, any>();

        for (const r of rowsShift) {
          if (Number(r.BUSID) !== busid) continue;

          const stop_id =
            r.STOP_ID !== null && r.STOP_ID !== undefined
              ? Number(r.STOP_ID)
              : null;

          if (stop_id === null) continue;

          if (!stopMap.has(stop_id)) {
            stopMap.set(stop_id, {
              stop_id,
              stop_name: r.STOP_NAME ?? null,
              plan_time: this.pickPlanTime(shift, r),
              route_seq:
                r.ROUTE_SEQ !== null && r.ROUTE_SEQ !== undefined
                  ? Number(r.ROUTE_SEQ)
                  : 9999,
            });
          }
        }

        const stopsSorted = Array.from(stopMap.values()).sort((a, b) => {
          const x = Number(a.route_seq ?? 9999);
          const y = Number(b.route_seq ?? 9999);
          if (x !== y) return x - y;
          return Number(a.stop_id) - Number(b.stop_id);
        });

        for (const s of stopsSorted) {
          const globalKey = `${dispatch_id}|${busid}|${s.stop_id}`;
          if (stopKeyByBusStop.has(globalKey)) continue;

          const stopEntity = manager.create(BusDispatchStop, {
            dispatch_id,
            line_id: busid, // line_id เก็บ BUSID
            stop_id: s.stop_id,
            stop_name: s.stop_name,
            plan_time: s.plan_time,
          });

          await manager.save(stopEntity);
          stopKeyByBusStop.set(globalKey, { stop_id: s.stop_id, line_id: busid });
        }
      }

      // 7) insert PASSENGER (unique ต่อ stop)
      const empSetByStop = new Map<number, Set<string>>();

      for (const r of rowsShift) {
        const busid = Number(r.BUSID);
        const stop_id =
          r.STOP_ID !== null && r.STOP_ID !== undefined
            ? Number(r.STOP_ID)
            : null;

        if (stop_id === null) continue;

        const globalKey = `${dispatch_id}|${busid}|${stop_id}`;
        if (!stopKeyByBusStop.has(globalKey)) continue;

        const empno = String(r.EMPNO).trim();
        if (!empSetByStop.has(stop_id)) empSetByStop.set(stop_id, new Set());
        empSetByStop.get(stop_id)!.add(empno);
      }

      const passengersToInsert: BusDispatchPassenger[] = [];
      for (const [stop_id, empSet] of empSetByStop.entries()) {
        for (const empno of empSet.values()) {
          passengersToInsert.push(
            manager.create(BusDispatchPassenger, {
              dispatch_id,
              stop_id,
              empno,
              status: 'E',
            }),
          );
        }
      }

      if (passengersToInsert.length) {
        await manager.save(BusDispatchPassenger, passengersToInsert);
      }

      created.push({
        shift,
        dispatch_id,
        status: head.status,
        lines: busIds.size,
        stops: stopKeyByBusStop.size,
        passengers: passengersToInsert.length,
        skipped: false,
      });

      return { ok: true, created };
    });
  }

  async getDispatch(dto: DispatchKeyDto) {
    const workDate = this.toOracleDateOnly(dto.workdate);

    const head = await this.headRepo.findOne({
      where: {
        dispatch_date: workDate,
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
        where: { dispatch_id } as any,
        order: { busid: 'ASC' as any },
      }),

      this.stopRepo.find({
        where: { dispatch_id } as any,
        order: { line_id: 'ASC' as any, stop_id: 'ASC' as any },
      }),

      this.passRepo.find({
        where: { dispatch_id, status: 'E' } as any,
        order: { stop_id: 'ASC' as any, empno: 'ASC' as any },
      }),
    ]);

    const empnos = [
      ...new Set(
        passengers
          .map((p) => String((p as any).empno || '').trim())
          .filter(Boolean),
      ),
    ];

    const empInfoMap = new Map<
      string,
      {
        empno: string;
        engname: string | null;
        thainame: string | null;
        ssec: string | null;
        sdept: string | null;
        sdiv: string | null;
      }
    >();

    if (empnos.length) {
      const bindSql = empnos.map((_, i) => `:${i + 1}`).join(',');

      const empRows: any[] = await this.dataSource.query(
        `
        SELECT
          U.SEMPNO,
          U.SSEC,
          U.SDEPT,
          U.SDIV,
          U.SNAME,
          U.STNAME AS STNAME
        FROM AMEC.AMECUSERALL U
        WHERE U.SEMPNO IN (${bindSql})
        `,
        empnos,
      );

      for (const r of empRows) {
        const empno = String(r.SEMPNO).trim();

        empInfoMap.set(empno, {
          empno,
          engname: r.SNAME ?? null,
          thainame: r.STNAME ?? null,
          ssec: r.SSEC ?? null,
          sdept: r.SDEPT ?? null,
          sdiv: r.SDIV ?? null,
        });
      }
    }

    const passByStopId = new Map<
      number,
      Array<{
        empno: string;
        engname: string | null;
        thainame: string | null;
        ssec: string | null;
        sdept: string | null;
        sdiv: string | null;
      }>
    >();

    for (const p of passengers) {
      const sid = Number((p as any).stop_id);
      const empno = String((p as any).empno).trim();
      const empInfo = empInfoMap.get(empno);

      if (!passByStopId.has(sid)) passByStopId.set(sid, []);

      passByStopId.get(sid)!.push({
        empno,
        engname: empInfo?.engname ?? null,
        thainame: empInfo?.thainame ?? null,
        ssec: empInfo?.ssec ?? null,
        sdept: empInfo?.sdept ?? null,
        sdiv: empInfo?.sdiv ?? null,
      });
    }

    const stopsByLineId = new Map<number, any[]>();

    for (const s of stops) {
      const lid = Number((s as any).line_id);
      const sid = Number((s as any).stop_id);

      const out = {
        dispatch_id,
        line_id: lid,
        stop_id: sid,
        stop_name: (s as any).stop_name,
        plan_time: (s as any).plan_time,
        passenger_count: (passByStopId.get(sid) || []).length,
        passengers: passByStopId.get(sid) || [],
      };

      if (!stopsByLineId.has(lid)) stopsByLineId.set(lid, []);

      stopsByLineId.get(lid)!.push(out);
    }

    const linesOut = lines.map((l) => {
      const busid = Number((l as any).busid);

      const lineStops = stopsByLineId.get(busid) || [];

      const passenger_count = lineStops.reduce(
        (sum, stop) => sum + (stop.passengers?.length || 0),
        0,
      );

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
      const empno = String(dto.empno).trim();
      const head = await manager.findOne(BusDispatchHead, { where: { dispatch_id }, });
      if (!head) throw new Error('DISPATCH_NOT_FOUND');
      if (head.status === 'C') throw new Error('DISPATCH_CLOSED');

      const stop = await manager.findOne(BusDispatchStop, {  where: { dispatch_id, stop_id } as any, });
      if (!stop) throw new Error('STOP_NOT_FOUND');

      let passenger = await manager.findOne(BusDispatchPassenger, {  where: { dispatch_id, empno } as any, });

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

      return { ok: true, dispatch_id, stop_id, empno };
    });
  }
}