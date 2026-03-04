import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { GetOrInitDto } from './dto/get-or-init.dto';
import { SaveDispatchDto } from './dto/save-dispatch.dto';
import { SaveOverwriteDto } from './dto/save-overwrite.dto';
import { BuildDailyFirstDto } from './dto/build-daily-first.dto';

import { BusDispatchHead } from './entities/bus_dispatch_head.entity';
import { BusDispatchLine } from './entities/bus_dispatch_line.entity';
import { BusDispatchStop } from './entities/bus_dispatch_stop.entity';
import { BusDispatchPassenger } from './entities/bus_dispatch_passenger.entity';



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

async getOrInit(dto: GetOrInitDto) {
  console.log('[getOrInit] dispatch_date raw =', dto.dispatch_date, 'type =', typeof dto.dispatch_date);
  const dispatchDate = this.toOracleDateOnly(dto.dispatch_date);
  const head = await this.headRepo.findOne({
    where: {
      dispatch_date: dispatchDate,
      dispatch_type: dto.dispatch_type,
      shift: dto.shift,
    },
  });

    if (!head) {
    const created = this.headRepo.create({
      dispatch_date: dispatchDate,
      dispatch_type: dto.dispatch_type,
      shift: dto.shift,
      status: 'D',
      update_by: dto.update_by,
      update_date: new Date(),
    });

    const savedHead = await this.headRepo.save(created);
      return {
        dispatch_id: savedHead.dispatch_id,
        dispatch_date: this.fmtMMDDYYYY(savedHead.dispatch_date),
        dispatch_type: savedHead.dispatch_type,
        shift: savedHead.shift,
        status: savedHead.status,
        update_by: savedHead.update_by,
        update_date: this.fmtMMDDYYYY(savedHead.update_date),
        lines: [],
      };
    }

    // ===== load lines =====
    const lines = await this.lineRepo.find({
      where: { dispatch_id: head.dispatch_id } as any,
    });

    const lineIds = lines.map((l: any) => l.line_id);

    // ===== load stops =====
    const stops = lineIds.length
      ? await this.stopRepo.find({
          where: { line_id: In(lineIds) } as any,
        })
      : [];

    const stopDispatchIds = stops.map((s: any) => s.stop_dispatch_id);

    // ===== load passengers =====
    // สมมติ passenger entity มี stop_dispatch_id
    const passengers = stopDispatchIds.length
      ? await this.passRepo.find({
          where: { stop_dispatch_id: In(stopDispatchIds) } as any,
        })
      : [];

    // ===== nest passengers by stop_dispatch_id =====
    const passengersByStop = new Map<number, any[]>();
    for (const p of passengers as any[]) {
      const key = p.stop_dispatch_id;
      if (!passengersByStop.has(key)) passengersByStop.set(key, []);
      passengersByStop.get(key)!.push({
        dispatch_pass_id: p.dispatch_pass_id,
        empno: p.empno,
      });
    }

    // ===== nest stops by line_id =====
    const stopsByLine = new Map<number, any[]>();
    for (const s of stops as any[]) {
      const key = s.line_id;
      const stopKey = s.stop_dispatch_id;

      const stopOut = {
        stop_dispatch_id: s.stop_dispatch_id,
        stop_id: s.stop_id,
        stop_name: s.stop_name,
        plan_time: s.plan_time,
        passenger_count: s.passenger_count,
        passengers: passengersByStop.get(stopKey) || [],
      };

      if (!stopsByLine.has(key)) stopsByLine.set(key, []);
      stopsByLine.get(key)!.push(stopOut);
    }

    // ===== output lines =====
    const linesOut = (lines as any[]).map((l) => ({
      line_id: l.line_id,
      dispatch_id: l.dispatch_id,
      busid: l.busid,
      busname: l.busname,
      bustype: l.bustype,
      busseat: l.busseat,
      line_status: l.line_status,
      stops: stopsByLine.get(l.line_id) || [],
    }));


    return {
      dispatch_id: head.dispatch_id,
      dispatch_date: head.dispatch_date,
      dispatch_type: head.dispatch_type,
      shift: head.shift,
      status: head.status,
      update_by: head.update_by,
      update_date: head.update_date,
      lines: linesOut,
    };
  }


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
      // key = `${busid}|${stop_id}` -> value = { stop_id, line_id }
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
            seq: stopSeq++,
            plan_time: s.plan_time,
            passenger_count: 0,
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

}
