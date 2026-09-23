import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { JigRepository } from './jig.repository';
import { CreateJigRequestDto } from './dto/create-jig-request.dto';
import { UpdateJigDto } from './dto/update-jig.dto';
import { ReplaceCheckpointsDto } from './dto/checkpoint.dto';
import {
    CreateJigFormDto,
    JigFormKeyDto,
    SaveJigFormDto,
    JigFileDto,
} from './dto/jig-form.dto';
import { FinishInspectionDto } from './dto/finish-inspection.dto';
import { monthStart } from './jig.utils';

@Injectable()
export class JigService {
    constructor(private readonly jigRepository: JigRepository) {}

    getMfgProcesses() {
        return this.jigRepository.getMfgProcesses();
    }

    getLocations() {
        return this.jigRepository.getLocations();
    }

    getIePics() {
        return this.jigRepository.getIePics();
    }

    async getDashboard() {
        // Status is a Thai business calendar date, independent of server timezone.
        const parts = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).formatToParts(new Date());
        const part = (type: string) => parts.find((p) => p.type === type).value;
        const asOf = part('year') + '-' + part('month') + '-' + part('day');
        const today = Date.UTC(
            Number(part('year')),
            Number(part('month')) - 1,
            Number(part('day')),
        );
        const masters = await this.jigRepository.getDashboardMaster();
        const items = masters.map((jig) => {
            const due = jig.NEXT_INSPEC_DATE
                ? monthStart(jig.NEXT_INSPEC_DATE)
                : null;
            const days = due
                ? Math.round(
                      (Date.UTC(
                          due.getFullYear(),
                          due.getMonth(),
                          due.getDate(),
                      ) -
                          today) /
                          86400000,
                  )
                : null;
            const status = !due
                ? 'UNSCHEDULED'
                : days < 0
                  ? 'OVERDUE'
                  : days === 0
                    ? 'DUE'
                    : days <= 30
                      ? 'DUE_SOON'
                      : 'PLANNED';
            return {
                ...jig,
                DUE_STATUS: status,
                DASHBOARD_STATUS: status,
                DAYS_UNTIL_DUE: days,
                IS_DUE: days !== null && days <= 0,
            };
        });
        return {
            asOf,
            dueSoonDays: 30,
            summary: {
                total: items.length,
                dueToday: items.filter((j) => j.DUE_STATUS === 'DUE').length,
                dueSoon: items.filter((j) => j.DUE_STATUS === 'DUE_SOON')
                    .length,
                overdue: items.filter((j) => j.DUE_STATUS === 'OVERDUE').length,
                planned: items.filter((j) => j.DUE_STATUS === 'PLANNED').length,
                unscheduled: items.filter((j) => j.DUE_STATUS === 'UNSCHEDULED')
                    .length,
            },
            items,
        };
    }

    async getJig(jigNo: string) {
        const jig = await this.jigRepository.findMaster(jigNo);
        if (!jig) throw new NotFoundException('Jig not found');
        return jig;
    }

    createJig(dto: CreateJigRequestDto) {
        if (dto.FORM_TYPE !== 'CREATE')throw new BadRequestException('New jig registration requires FORM_TYPE CREATE',);
        return this.jigRepository.createForm(dto.JIG_NO, dto);
    }

    async updateJig(jigNo: string, dto: UpdateJigDto) {
        const { FORM_KEY, ...changes } = dto;
        const form = await this.jigRepository.getForm(FORM_KEY);
        if (form.JIG_NO !== jigNo)
            throw new BadRequestException('The form belongs to another jig');
        return this.jigRepository.saveForm(FORM_KEY, changes);
    }

    async getCheckpoints(jigNo: string) {
        await this.getJig(jigNo);
        return this.jigRepository.getCheckpoints(jigNo);
    }
    replaceCheckpoints(jigNo: string, dto: ReplaceCheckpointsDto) {
        return this.jigRepository.replaceCheckpoints(jigNo, dto);
    }
    async listForms(jigNo: string) {
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

    applyFormToMaster(key: JigFormKeyDto, dto: FinishInspectionDto) {
        return this.jigRepository.applyFormToMaster(key, dto.UPDATE_BY);
    }
}
