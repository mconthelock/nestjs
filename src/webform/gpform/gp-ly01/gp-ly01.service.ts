import { Injectable } from '@nestjs/common';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { FormService } from 'src/webform/form/form.service';
import { EmptaxService } from 'src/as400/datalibi/emptax/emptax.service';
import { GPLY01_TAX } from 'src/common/Entities/webform/table/GPLY01_TAX.entiry';
import { GpLy01Repository } from './gp-ly01.repository';

@Injectable()
export class GpLy01Service {
    constructor(
        private readonly doactionFlowService: DoactionFlowService,
        private readonly formService: FormService,
        private readonly emptaxService: EmptaxService,
        private readonly repo: GpLy01Repository,
    ) {}

    async approve(dto: doactionFlowDto, ip: string) {
        try {
            const form: FormDto = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };

            const doAction = await this.doactionFlowService.doAction(
                {
                    ...form,
                    ACTION: dto.ACTION,
                    EMPNO: dto.EMPNO,
                    REMARK: dto.REMARK,
                    ...(dto.CEXTDATA !== undefined && { CEXTDATA: dto.CEXTDATA }),
                },
                ip,
            );
            if (!doAction.status) {
                throw new Error(doAction.message);
            }

            const cst = await this.formService.getFormStatus(form);
            if (cst === '2') {
                const taxForm = await this.repo.findTaxForm(form);
                if (!taxForm?.EMPCOD) {
                    throw new Error('GP-LY01 tax form not found');
                }

                await this.insertAs400Emptax(taxForm);
            }

            return doAction;
        } catch (error) {
            throw new Error(`Failed to approve GP-LY01: ${error.message}`);
        }
    }

    private async insertAs400Emptax(taxForm: GPLY01_TAX) {
        await this.emptaxService.insert({
            XAMCOD: (taxForm.EMPCOD ?? '').trim(),
            XAMRST: this.mapMaritalStatusCode(taxForm.MARSTE),
            XAMMRD: this.formatAs400Date(taxForm.FAMMRD),
            XAMSNA: (taxForm.FAMSNA ?? '').trim(),
            XABNED: Number(taxForm.C1NED ?? 0) || 0,
            XAANED: Number(taxForm.C2NED ?? 0) || 0,
            XABIED: Number(taxForm.C1IED ?? 0) || 0,
            XAAIED: Number(taxForm.C2IED ?? 0) || 0,
            XAXEMF: (taxForm.TAXEMF ?? '').trim(),
            XAXEMM: (taxForm.TAXEMM ?? '').trim(),
            XAXSFT: (taxForm.TAXSFT ?? '').trim(),
            XAXSPM: (taxForm.TAXSPM ?? '').trim(),
            XAXINS: Number(taxForm.TAXINS ?? 0) || 0,
            XAXSIN: 0,
            XAXRMF: Number(taxForm.TAXRMF ?? 0) || 0,
            XAXLTF: Number(taxForm.TAXLTF ?? 0) || 0,
            XAXINL: Number(taxForm.TAXINL ?? 0) || 0,
            XAXEDU: Number(taxForm.TAXEDU ?? 0) || 0,
            XAXDON: Number(taxForm.TAXDON ?? 0) || 0,
            XAXINH: Number(taxForm.TAXINH ?? 0) || 0,
            XAXINP: Number(taxForm.TAXINP ?? 0) || 0,
            XAXANU: Number(taxForm.TAXANU ?? 0) || 0,
            XAXDIS: Number(taxForm.TAXDIS ?? 0) || 0,
            XAXPRG: Number(taxForm.TAXPRG ?? 0) || 0,
            XAXOT1: Number(taxForm.TAXOT1 ?? 0) || 0,
            XAXOT2: Number(taxForm.TAXOT2 ?? 0) || 0,
            XSTS: 'N',
        });
    }

    private mapMaritalStatusCode(marste?: string): string {
        const normalized = (marste ?? '').replace(/\s+/g, '').toUpperCase();
        switch (normalized) {
            case 'SINGLE':
            case 'SS':
                return 'SS';
            case 'DIVORCE/WIDOW':
            case 'SD':
                return 'SD';
            case 'MARRIED&SPOUSEDOESNOTWORK':
            case 'MN':
                return 'MN';
            case 'MARRIED&SPOUSEDOESWORK':
            case 'MS':
                return 'MS';
            default:
                return (marste ?? '').trim().slice(0, 2).toUpperCase();
        }
    }

    private formatAs400Date(date?: Date | string | number | null): number {
        if (!date) return 0;
        if (typeof date === 'number') {
            return Number.isFinite(date) ? date : 0;
        }
        if (typeof date === 'string') {
            const digits = date.replace(/\D/g, '');
            if (digits.length === 8) return Number(digits);
        }
        const d = date instanceof Date ? date : new Date(date);
        if (Number.isNaN(d.getTime())) return 0;
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return Number(`${yyyy}${mm}${dd}`);
    }
}
