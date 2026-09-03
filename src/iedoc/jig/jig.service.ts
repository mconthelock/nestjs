import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { JigRepository } from './jig.repository';
import { CreateJigDto } from './dto/create-jig.dto';
import { FinishInspectionDto } from './dto/finish-inspection.dto';

@Injectable()
export class JigService {
    constructor(
        private readonly jigRepository: JigRepository,
    ) {}

    private getCurrentFiscalYear() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;

        return month >= 4 ? year : year - 1;
    }

    private getFiscalPeriod(fyear: number) {
        return {
            startDate: new Date(fyear, 3, 1),
            endDate: new Date(fyear + 1, 3, 1),
        };
    }

    private getDashboardStatus(nextDate: Date) {
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const next = new Date(nextDate);
        next.setHours(0, 0, 0, 0);

        const diffDay = Math.ceil(
            (next.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        if (diffDay < 0) {
            return 'OVERDUE';
        }

        if (diffDay <= 30) {
            return 'DUE_SOON';
        }

        return 'PLANNED';
    }

    async getDashboard(fyear?: number) {
        const fiscalYear =
            fyear || this.getCurrentFiscalYear();

        const { startDate, endDate } =
            this.getFiscalPeriod(fiscalYear);

        const [masters, inspections] =
            await Promise.all([
                this.jigRepository.getDashboardMaster(),
                this.jigRepository.getInspectionByPeriod(
                    startDate,
                    endDate,
                ),
            ]);

        const items = masters.map(jig => {
            const jigInspections = inspections.filter(
                inspection =>
                    inspection.JIG_NO === jig.JIG_NO,
            );

            const status = this.getDashboardStatus(
                jig.NEXT_INSPEC_DATE,
            );

            return {
                ...jig,
                DASHBOARD_STATUS: status,
                INSPECTIONS: jigInspections,
            };
        });

        const completed = items.filter(item =>
            item.INSPECTIONS.some(
                inspection =>
                    inspection.INSPEC_STATUS === 'FINISH',
            ),
        ).length;

        const dueSoon = items.filter(
            item =>
                item.DASHBOARD_STATUS === 'DUE_SOON',
        ).length;

        const overdue = items.filter(
            item =>
                item.DASHBOARD_STATUS === 'OVERDUE',
        ).length;

        return {
            fyear: fiscalYear,
            period: {
                from: startDate,
                to: new Date(
                    endDate.getTime() - 86400000,
                ),
            },
            summary: {
                total: items.length,
                completed,
                remain: items.length - completed,
                dueSoon,
                overdue,
            },
            items,
        };
    }

    async createJig(dto: CreateJigDto) {
        const exists =
            await this.jigRepository.findMaster(
                dto.JIG_NO,
            );

        if (exists) {
            throw new ConflictException(
                `JIG_NO ${dto.JIG_NO} already exists`,
            );
        }

        const nextInspection =
            new Date(dto.NEXT_INSPEC_DATE);

        nextInspection.setDate(1);

        return this.jigRepository.createMaster({
            JIG_NO: dto.JIG_NO,
            JIG_NAME: dto.JIG_NAME,
            DRAWING_NO: dto.DRAWING_NO || null,
            JIG_QTY: dto.JIG_QTY ?? null,
            PRICE: dto.PRICE ?? null,
            MAKER: dto.MAKER || null,
            START_USE_DATE: dto.START_USE_DATE
                ? new Date(dto.START_USE_DATE)
                : null,
            ITEMNO: dto.ITEMNO || null,
            PARTS: dto.PARTS || null,
            PROCESS_CODE: dto.PROCESS_CODE || null,
            PIC_EMPNO: dto.PIC_EMPNO || null,
            INSPEC_PERIOD: dto.INSPEC_PERIOD,
            NEXT_INSPEC_DATE: nextInspection,
            JIG_STATUS: 'ACTIVE',
            REMARK: dto.REMARK || null,
            CREATE_BY: dto.CREATE_BY || null,
            CREATE_DATE: new Date(),
            UPDATE_BY: null,
            UPDATE_DATE: null,
        });
    }

    async finishInspection(
        inspecId: number,
        dto: FinishInspectionDto,
    ) {
        const inspection =
            await this.jigRepository.findInspection(
                inspecId,
            );

        if (!inspection) {
            throw new NotFoundException(
                `INSPEC_ID ${inspecId} not found`,
            );
        }

        if (
            inspection.INSPEC_STATUS === 'FINISH'
        ) {
            throw new ConflictException(
                `INSPEC_ID ${inspecId} is already FINISH`,
            );
        }

        const result =
            await this.jigRepository.finishInspection(
                inspecId,
                dto.INSPEC_DATE
                    ? new Date(dto.INSPEC_DATE)
                    : undefined,
                dto.UPDATE_BY,
            );

        if (!result) {
            throw new NotFoundException(
                'JIG or Inspection not found',
            );
        }

        return {
            message: 'Inspection finished successfully',
            INSPEC_ID: result.inspection.INSPEC_ID,
            JIG_NO: result.jig.JIG_NO,
            INSPEC_STATUS:
                result.inspection.INSPEC_STATUS,
            INSPEC_DATE:
                result.inspection.INSPEC_DATE,
            NEXT_INSPEC_DATE:
                result.jig.NEXT_INSPEC_DATE,
        };
    }
}