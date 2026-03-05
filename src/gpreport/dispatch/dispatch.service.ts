import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { SaveDispatchDto } from './dto/save-dispatch.dto';
import { SaveOverwriteDto } from './dto/save-overwrite.dto';
import { BuildDailyFirstDto } from './dto/build-daily-first.dto';

import { BusDispatchHead } from './entities/bus_dispatch_head.entity';
import { BusDispatchLine } from './entities/bus_dispatch_line.entity';
import { BusDispatchStop } from './entities/bus_dispatch_stop.entity';
import { BusDispatchPassenger } from './entities/bus_dispatch_passenger.entity';
import { DispatchKeyDto } from './dto/dispatch-key.dto';


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
    // dto: { dispatch_id, update_by }
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

    // case: already Date
    if (input instanceof Date && !isNaN(input.getTime())) {
      return new Date(input.getFullYear(), input.getMonth(), input.getDate());
    }

    const s = String(input).trim();

    // case: ISO datetime e.g. 2026-03-04T00:00:00.000Z
    const iso = new Date(s);
    if (!isNaN(iso.getTime())) {
      return new Date(iso.getFullYear(), iso.getMonth(), iso.getDate());
    }

    // case: YYYY-MM-DD
    const m1 = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m1) {
      const y = Number(m1[1]);
      const m = Number(m1[2]);
      const d = Number(m1[3]);
      return new Date(y, m - 1, d);
    }

    // case: DD/MM/YYYY
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
    const head = await this.headRepo.findOne({ where: { dispatch_id: dto.dispatch_id } });
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
          OT.WORKDATE,OT.TIMEIN,OT.TIMEOUT,OT.EMPNO,
          LINE.BUSID,LINE.BUSNAME,LINE.BUSSEAT,LINE.BUSTYPE,LINE.IS_CHONBURI,
          STOP.STOP_ID,STOP.STOP_NAME,STOP.WORKDAY_TIMEIN,STOP.NIGHT_TIMEIN,STOP.HOLIDAY_TIMEIN,
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
        ORDER BY OT.EMPNO
        `,
        [
          workDate,         // :1
          dto.timeout_to,   // :2
          dto.timeout_from, // :3
        ],
      );

      if (!rows.length) {return { ok: true, message: 'NO_OT_ROWS', created: [] };}
      const shift = dto.shift;
      const rowsShift = rows;
      const created: Array<any> = [];

      // 3) find head by (date,type,shift)
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

      // 4) create head
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
            busseat: r.BUSSEAT !== null && r.BUSSEAT !== undefined ? Number(r.BUSSEAT) : null,
            bustype: r.BUSTYPE ?? null,
          });
        }
      }

      // sort lines (เอา busname ก่อน ถ้าไม่มีใช้ busid)
      const buses = Array.from(busMap.values()).sort((a, b) => {
        const an = String(a.busname ?? '').toLowerCase();
        const bn = String(b.busname ?? '').toLowerCase();
        if (an && bn) return an.localeCompare(bn);
        return Number(a.busid) - Number(b.busid);
      });

      const lineIdByBusId = new Map<number, number>();
      let lineSeq = 1;

      for (const b of buses) {
        const line_id = lineSeq++;
        const line = manager.create(BusDispatchLine, {
          dispatch_id,
          line_id,
          busid: b.busid,
          busname: b.busname,
          bustype: b.bustype,
          busseat: b.busseat,
          line_status: '1',
        });

        await manager.save(line);
        lineIdByBusId.set(b.busid, line_id);
      }

      // 6) build STOP groups per BUSID (distinct STOP_ID) + order by ROUTE_SEQ
      const stopKeyByBusStop = new Map<string, { stop_id: number; line_id: number }>();
      for (const [busid, line_id] of lineIdByBusId.entries()) {
        const stopMap = new Map<number, any>();
        for (const r of rowsShift) {
          if (Number(r.BUSID) !== busid) continue;
          const stop_id = r.STOP_ID !== null && r.STOP_ID !== undefined ? Number(r.STOP_ID) : null;
          if (stop_id === null) continue;
          if (!stopMap.has(stop_id)) {
            stopMap.set(stop_id, {
              stop_id,
              stop_name: r.STOP_NAME ?? null,
              plan_time: this.pickPlanTime(shift, r),
              route_seq: r.ROUTE_SEQ !== null && r.ROUTE_SEQ !== undefined ? Number(r.ROUTE_SEQ) : 9999,
            });
          }
        }

        const stopsSorted = Array.from(stopMap.values()).sort((a, b) => {
          const x = Number(a.route_seq ?? 9999);
          const y = Number(b.route_seq ?? 9999);
          if (x !== y) return x - y;
          return Number(a.stop_id) - Number(b.stop_id);
        });

        let stopSeq = 1;
        for (const s of stopsSorted) {
          const globalKey = `${dispatch_id}|${s.stop_id}`;
          if (stopKeyByBusStop.has(globalKey)) { continue; }
          const stopEntity = manager.create(BusDispatchStop, {
            dispatch_id,
            line_id,
            stop_id: s.stop_id,
            stop_name: s.stop_name,
            plan_time: s.plan_time,
          });

          await manager.save(stopEntity);
          stopKeyByBusStop.set(globalKey, { stop_id: s.stop_id, line_id });
        }
      }

      // 7) insert PASSENGER (unique ต่อ stop)
      const empSetByStop = new Map<number, Set<string>>(); // key = stop_id

      for (const r of rowsShift) {
        const stop_id = r.STOP_ID !== null && r.STOP_ID !== undefined ? Number(r.STOP_ID) : null;
        if (stop_id === null) continue;

        // ต้องมี stop แถวนี้จริงใน dispatch
        const globalKey = `${dispatch_id}|${stop_id}`;
        if (!stopKeyByBusStop.has(globalKey)) continue;

        const empno = String(r.EMPNO).trim();
        if (!empSetByStop.has(stop_id)) empSetByStop.set(stop_id, new Set());
        empSetByStop.get(stop_id)!.add(empno);
      }

      // bulk insert passengers
      const passengersToInsert: BusDispatchPassenger[] = [];
      for (const [stop_id, empSet] of empSetByStop.entries()) {
        for (const empno of empSet.values()) {
          passengersToInsert.push(
            manager.create(BusDispatchPassenger, {
              dispatch_id,
              stop_id,
              empno,
            }),
          );
        }
      }

      if (passengersToInsert.length) { await manager.save(BusDispatchPassenger, passengersToInsert); }

      created.push({
        shift,
        dispatch_id,
        status: head.status,
        lines: lineIdByBusId.size,
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
        order: { line_id: 'ASC' as any },
      }),
      this.stopRepo.find({
        where: { dispatch_id } as any,
        order: { line_id: 'ASC' as any, stop_id: 'ASC' as any },
      }),
      this.passRepo.find({
        where: { dispatch_id } as any,
        order: { stop_id: 'ASC' as any, empno: 'ASC' as any },
      }),
    ]);

    // passengers by stop_id
    const passByStopId = new Map<number, Array<{ empno: string }>>();
    for (const p of passengers) {
      const sid = Number((p as any).stop_id);
      if (!passByStopId.has(sid)) passByStopId.set(sid, []);
      passByStopId.get(sid)!.push({ empno: (p as any).empno });
    }

    // stops by line_id
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
        passengers: passByStopId.get(sid) || [],
      };

      if (!stopsByLineId.has(lid)) stopsByLineId.set(lid, []);
      stopsByLineId.get(lid)!.push(out);
    }

    const linesOut = lines.map((l) => ({
      dispatch_id,
      line_id: Number((l as any).line_id),
      busid: (l as any).busid,
      busname: (l as any).busname,
      bustype: (l as any).bustype,
      busseat: (l as any).busseat,
      line_status: (l as any).line_status,
      stops: stopsByLineId.get(Number((l as any).line_id)) || [],
    }));

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

}
