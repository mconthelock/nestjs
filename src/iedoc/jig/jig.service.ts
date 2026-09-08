import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { JigRepository } from './jig.repository';
import { CreateJigDto } from './dto/create-jig.dto';
import { UpdateJigDto } from './dto/update-jig.dto';
import { ReplaceCheckpointsDto } from './dto/checkpoint.dto';
import {
    CreateJigFormDto,
    JigFormKeyDto,
    SaveJigFormDto,
    JigFileDto,
} from './dto/jig-form.dto';
import { FinishInspectionDto } from './dto/finish-inspection.dto';
import { monthKey, monthStart, nextRound } from './jig.utils';

@Injectable()
export class JigService {
    constructor(private readonly jigRepository: JigRepository) {}

    private dueStatus(date: Date | null, today: Date) {
        if (!date) return 'UNSCHEDULED';
        const due = monthStart(date);
        const diff = Math.ceil((due.getTime() - today.getTime()) / 86400000);
        return diff < 0 ? 'OVERDUE' : diff <= 30 ? 'DUE_SOON' : 'PLANNED';
    }

    async getDashboard(fyear?: number) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const fiscalYear =
            fyear ??
            (today.getMonth() >= 3
                ? today.getFullYear()
                : today.getFullYear() - 1);
        if (
            !Number.isInteger(fiscalYear) ||
            fiscalYear < 1900 ||
            fiscalYear > 9998
        )
            throw new BadRequestException(
                'fyear must be an integer from 1900 to 9998',
            );
        const from = new Date(fiscalYear, 3, 1),
            to = new Date(fiscalYear + 1, 3, 1);
        const [masters, forms] = await Promise.all([
            this.jigRepository.getDashboardMaster(),
            this.jigRepository.getFormStates(),
        ]);
        const grouped = new Map<string, typeof forms>();
        for (const f of forms) {
            const rows = grouped.get(f.JIG_NO) ?? [];
            rows.push(f);
            grouped.set(f.JIG_NO, rows);
        }
        const items = masters.map((jig) => {
            const history = grouped.get(jig.JIG_NO) ?? [];
            const due = jig.NEXT_INSPEC_DATE
                ? monthStart(jig.NEXT_INSPEC_DATE)
                : null;
            const active = jig.JIG_STATUS === 'ACTIVE';
            const dueStatus = active ? this.dueStatus(due, today) : null;
            const inYear = history.filter(
                (f) =>
                    f.FORM_TYPE === 'INSPECTION' &&
                    f.SCHEDULE_DATE &&
                    f.SCHEDULE_DATE >= from &&
                    f.SCHEDULE_DATE < to,
            );
            const pending = history.find(
                (f) =>
                    ['0', '1'].includes(String(f.FORM_STATUS).trim()) &&
                    (f.FORM_TYPE === 'CREATE' ||
                        (due &&
                            f.SCHEDULE_DATE &&
                            monthKey(monthStart(f.SCHEDULE_DATE)) ===
                                monthKey(due))),
            );
            const approvedCurrent = history.find(
                (f) =>
                    f.FORM_TYPE === 'INSPECTION' &&
                    String(f.FORM_STATUS).trim() === '2' &&
                    due &&
                    f.SCHEDULE_DATE &&
                    monthKey(monthStart(f.SCHEDULE_DATE)) === monthKey(due),
            );
            const schedules = new Map<
                string,
                { SCHEDULE_DATE: string; FORMS: typeof forms; STATUS: string }
            >();
            for (const f of inYear) {
                const key = monthKey(monthStart(f.SCHEDULE_DATE));
                const entry = schedules.get(key) ?? {
                    SCHEDULE_DATE: key,
                    FORMS: [],
                    STATUS: 'PLANNED',
                };
                entry.FORMS.push(f);
                schedules.set(key, entry);
            }
            if (due && active) {
                let cursor = due;
                const period = Number(jig.INSPEC_PERIOD);
                if (Number.isInteger(period) && period > 0 && period <= 999) {
                    if (cursor < from) {
                        const months =
                            (from.getFullYear() - cursor.getFullYear()) * 12 +
                            from.getMonth() -
                            cursor.getMonth();
                        cursor = new Date(
                            cursor.getFullYear(),
                            cursor.getMonth() +
                                Math.ceil(months / period) * period,
                            1,
                        );
                    }
                    while (cursor < to) {
                        const key = monthKey(cursor);
                        if (!schedules.has(key))
                            schedules.set(key, {
                                SCHEDULE_DATE: key,
                                FORMS: [],
                                STATUS: 'PLANNED',
                            });
                        cursor = nextRound(cursor, period);
                    }
                }
            }
            for (const entry of schedules.values()) {
                entry.STATUS = entry.FORMS.some(
                    (f) => String(f.FORM_STATUS).trim() === '2',
                )
                    ? 'COMPLETED'
                    : entry.FORMS.some((f) =>
                            ['0', '1'].includes(String(f.FORM_STATUS).trim()),
                        )
                      ? 'IN_PROGRESS'
                      : 'PLANNED';
            }
            return {
                ...jig,
                DUE_STATUS: dueStatus,
                DASHBOARD_STATUS: !active
                    ? jig.JIG_STATUS
                    : Number(jig.CHECKPOINT_COUNT) === 0
                      ? 'NO_SHEET'
                      : approvedCurrent
                        ? 'AWAITING_SYNC'
                        : pending
                          ? 'IN_PROGRESS'
                          : dueStatus,
                IS_NEW_JIG:
                    !!jig.CREATE_DATE &&
                    jig.CREATE_DATE >= from &&
                    jig.CREATE_DATE < to,
                CURRENT_FORM: pending ?? approvedCurrent ?? null,
                SCHEDULES: [...schedules.values()].sort((a, b) =>
                    a.SCHEDULE_DATE.localeCompare(b.SCHEDULE_DATE),
                ),
                COMPLETED_ROUNDS: inYear.filter(
                    (f) => String(f.FORM_STATUS).trim() === '2',
                ).length,
            };
        });
        return {
            fyear: fiscalYear,
            period: { from, to: new Date(fiscalYear + 1, 2, 31) },
            summary: {
                total: items.length,
                completed: items.filter((j) => j.COMPLETED_ROUNDS > 0).length,
                completedRounds: items.reduce(
                    (sum, j) => sum + j.COMPLETED_ROUNDS,
                    0,
                ),
                dueSoon: items.filter((j) => j.DUE_STATUS === 'DUE_SOON')
                    .length,
                overdue: items.filter((j) => j.DUE_STATUS === 'OVERDUE').length,
                inProgress: items.filter(
                    (j) =>
                        j.CURRENT_FORM &&
                        ['0', '1'].includes(
                            String(j.CURRENT_FORM.FORM_STATUS).trim(),
                        ),
                ).length,
                noSheet: items.filter((j) => Number(j.CHECKPOINT_COUNT) === 0)
                    .length,
                newJig: items.filter((j) => j.IS_NEW_JIG).length,
            },
            items,
        };
    }

    async getJig(jigNo: string) {
        const jig = await this.jigRepository.findMaster(jigNo);
        if (!jig) throw new NotFoundException('Jig not found');
        return jig;
    }

    createJig(dto: CreateJigDto) {
        return this.jigRepository.createMaster({
            ...dto,
            NEXT_INSPEC_DATE: dto.NEXT_INSPEC_DATE
                ? monthStart(dto.NEXT_INSPEC_DATE)
                : null,
            START_USE_DATE: dto.START_USE_DATE
                ? new Date(dto.START_USE_DATE)
                : null,
            JIG_STATUS: 'DRAFT',
            CREATE_DATE: new Date(),
            UPDATE_BY: null,
            UPDATE_DATE: null,
        });
    }

    updateJig(jigNo: string, dto: UpdateJigDto) {
        const { NEXT_INSPEC_DATE, START_USE_DATE, ...fields } = dto;
        return this.jigRepository.updateMaster(jigNo, {
            ...fields,
            ...(NEXT_INSPEC_DATE !== undefined
                ? {
                      NEXT_INSPEC_DATE: NEXT_INSPEC_DATE
                          ? monthStart(NEXT_INSPEC_DATE)
                          : null,
                  }
                : {}),
            ...(START_USE_DATE !== undefined
                ? {
                      START_USE_DATE: START_USE_DATE
                          ? new Date(START_USE_DATE)
                          : null,
                  }
                : {}),
        });
    }

    async getCheckpoints(jigNo: string) {
        await this.getJig(jigNo);
        return this.jigRepository.getCheckpoints(jigNo);
    }
    replaceCheckpoints(jigNo: string, dto: ReplaceCheckpointsDto) {
        return this.jigRepository.replaceCheckpoints(jigNo, dto);
    }
    async listForms(jigNo: string) {
        await this.getJig(jigNo);
        return this.jigRepository.getFormStates(jigNo);
    }
    createForm(jigNo: string, dto: CreateJigFormDto) {
        return this.jigRepository.createForm(jigNo, dto);
    }
    getForm(key: JigFormKeyDto) {
        return this.jigRepository.getForm(key);
    }
    saveForm(key: JigFormKeyDto, dto: SaveJigFormDto) {
        return this.jigRepository.saveForm(key, dto);
    }
    putFile(key: JigFormKeyDto, dto: JigFileDto) {
        return this.jigRepository.putFile(key, dto);
    }
    deleteFile(key: JigFormKeyDto, fileSeq: number) {
        return this.jigRepository.deleteFile(key, fileSeq);
    }
    finishForm(key: JigFormKeyDto, dto: FinishInspectionDto) {
        return this.jigRepository.finishForm(key, dto.UPDATE_BY);
    }
}
