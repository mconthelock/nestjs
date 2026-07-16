import { Injectable } from '@nestjs/common';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { UsersService } from 'src/amec/users/users.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { FlowService } from 'src/webform/flow/flow.service';
import {
    CreatePsClmDetailDto,
    CreatePsClmReqFormDto,
} from './dto/create-ps-clm.dto';
import { UpdatePsClmDto } from './dto/update-ps-clm.dto';
import { PsClmRepository } from './ps-clm.repository';

const ASSIGN_CONTROLLERS = ['12177', '14036', '16066'];
const ORDER_PREFIXES = { ET: 'ET2C', ST: 'ST2C' } as const;

export function formatPsClmOrderNo(orderNo: string, sequence: number) {
    const type = String(orderNo || '')
        .trim()
        .slice(0, 2)
        .toUpperCase();
    const prefix = ORDER_PREFIXES[type];
    if (!prefix) return '';

    const index = sequence - 1;
    const suffix =
        type === 'ET'
            ? `${letterAt(Math.floor(index / 999))}${String((index % 999) + 1).padStart(3, '0')}`
            : `${letterAt(Math.floor(index / 234))}0${letterAt(Math.floor(index / 9) % 26)}${(index % 9) + 1}`;
    return addOrderCheckBit(`${prefix}${suffix}`);
}

export function nextPsClmOrderNo(
    orderNo: string,
    usedOrders: Iterable<string>,
) {
    const type = String(orderNo || '')
        .trim()
        .slice(0, 2)
        .toUpperCase();
    if (!ORDER_PREFIXES[type]) return '';

    const used = new Set(usedOrders);
    const limit = type === 'ET' ? 26 * 999 : 26 * 234;
    for (let sequence = 1; sequence <= limit; sequence++) {
        const candidate = formatPsClmOrderNo(orderNo, sequence);
        if (!used.has(candidate)) return candidate;
    }
    throw new Error(`New order number range for ${type} is full`);
}

function letterAt(index: number) {
    return String.fromCharCode(65 + index);
}

function addOrderCheckBit(orderNo: string) {
    const sum = orderNo
        .slice(0, 8)
        .toUpperCase()
        .split('')
        .reduce((total, char, index) => {
            const a = 'ABCDEFGHI'.indexOf(char);
            const j = 'JKLMNOPQR'.indexOf(char);
            const s = 'STUVWXYZ'.indexOf(char);
            const value = /\d/.test(char)
                ? Number(char)
                : a >= 0
                  ? a + 1
                  : j >= 0
                    ? j + 1
                    : s >= 0
                      ? s + 2
                      : 0;
            return total + value * 10 ** (7 - index);
        }, 0);
    return `${orderNo}${sum % 7}`;
}

@Injectable()
export class PsClmService {
    constructor(
        private readonly repo: PsClmRepository,
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
        private readonly doactionService: DoactionFlowService,
        private readonly flowService: FlowService,
        private readonly usersService: UsersService,
    ) {}

    async create(dto: CreatePsClmReqFormDto, ip: string) {
        const formmst =
            await this.formmstService.getFormMasterByVaname('PS-CLM');
        if (!formmst) {
            throw new Error(
                'Form master not found for PS-CLM. Check FORMMST table.',
            );
        }

        const details = this.parseDetails(dto.DETAILS);
        const originalOrder = String(
            details.find(
                (detail) =>
                    ORDER_PREFIXES[
                        String(detail.ORDERNO || '')
                            .trim()
                            .slice(0, 2)
                            .toUpperCase()
                    ],
            )?.ORDERNO || '',
        );
        if (!originalOrder) {
            throw new Error('Original Order must start with ET or ST');
        }

        await this.repo.lockForms();
        const type = originalOrder.trim().slice(0, 2).toUpperCase();
        const newOrderNo = nextPsClmOrderNo(
            originalOrder,
            await this.repo.findNewOrders(ORDER_PREFIXES[type]),
        );

        const createForm = await this.formCreateService.create(
            {
                NFRMNO: formmst.NNO,
                VORGNO: formmst.VORGNO,
                CYEAR: formmst.CYEAR,
                REQBY: dto.REQBY,
                INPUTBY: dto.INPUTBY,
                REMARK: dto.REMARK,
            },
            ip,
        );
        if (!createForm?.status) {
            const errMsg =
                createForm?.message?.message ||
                createForm?.message ||
                'Unknown error';
            throw new Error(`Form creation failed: ${errMsg}`);
        }

        const form = {
            NFRMNO: createForm.data.NFRMNO,
            VORGNO: createForm.data.VORGNO,
            CYEAR: createForm.data.CYEAR,
            CYEAR2: createForm.data.CYEAR2,
            NRUNNO: createForm.data.NRUNNO,
        };
        const psclmForm = await this.repo.createForm({
            ...form,
            NEWORDER: newOrderNo,
            REMARK: dto.REMARK ?? '',
        });

        const list = await this.saveDetails(form, details);

        return {
            status: true,
            message: 'PS-CLM form created successfully',
            data: { form, psclmForm, list, NEWORDER: newOrderNo },
        };
    }

    async nextOrder(orderNo: string) {
        const type = String(orderNo || '')
            .trim()
            .slice(0, 2)
            .toUpperCase();
        if (!ORDER_PREFIXES[type]) {
            throw new Error('Original Order must start with ET or ST');
        }
        return {
            status: true,
            newOrderNo: nextPsClmOrderNo(
                orderNo,
                await this.repo.findNewOrders(ORDER_PREFIXES[type]),
            ),
        };
    }

    async update(dto: UpdatePsClmDto, ip: string) {
        const form = this.pickForm(dto);
        if (dto.ACTION === 'approve') {
            if (String(dto.CEXTDATA || '').trim() === '01') {
                await this.assignController(form, dto.CONTROLLER);
            }
            if (String(dto.CEXTDATA || '').trim() === '02') {
                await this.updateDetailSchedules(form, dto.DETAILS);
            }
        }

        const doAction = await this.doactionService.doAction(
            {
                ...form,
                EMPNO: dto.EMPNO,
                ACTION: dto.ACTION,
                REMARK: dto.REMARK,
            },
            ip,
        );
        if (!doAction.status) throw new Error(doAction.message);

        return {
            status: true,
            message: 'PS-CLM action completed successfully',
        };
    }

    findOne(dto: FormDto) {
        return this.repo.findOneWithList(dto);
    }

    async findReport(year: string | null, filters: Record<string, string>) {
        const datareport = await this.repo.findReport(year, filters);

        return {
            status: true,
            message: 'Get PS-CLM report success',
            datareport,
        };
    }

    private pickForm(dto: FormDto): FormDto {
        return {
            NFRMNO: dto.NFRMNO,
            VORGNO: dto.VORGNO,
            CYEAR: dto.CYEAR,
            CYEAR2: dto.CYEAR2,
            NRUNNO: dto.NRUNNO,
        };
    }

    private async assignController(form: FormDto, controller?: string) {
        const empno = String(controller || '').trim();
        if (!/^\d{5}$/.test(empno)) {
            throw new Error('Controller must be a 5 digit employee number');
        }
        if (!ASSIGN_CONTROLLERS.includes(empno)) {
            throw new Error('Controller is not allowed for PS-CLM');
        }
        if (!(await this.usersService.findEmp(empno))) {
            throw new Error('Controller employee not found');
        }

        const update = await this.flowService.updateFlow({
            condition: {
                ...form,
                CEXTDATA: '02',
            },
            VAPVNO: empno,
        });
        if (!update.status) throw new Error(update.message);
    }

    private saveDetails(
        form: FormDto,
        details?: CreatePsClmReqFormDto['DETAILS'],
    ) {
        return this.repo.replaceDetails(
            form,
            this.parseDetails(details).map((detail) =>
                this.toDetailEntity(form, detail),
            ),
        );
    }

    private updateDetailSchedules(
        form: FormDto,
        details?: CreatePsClmReqFormDto['DETAILS'],
    ) {
        return this.repo.updateDetailSchedules(
            form,
            this.parseDetails(details).map((detail) =>
                this.toDetailEntity(form, detail),
            ),
        );
    }

    private toDetailEntity(form: FormDto, detail: CreatePsClmDetailDto) {
        const row = detail as any;
        return {
            ...form,
            ORDERNO: row.ORDERNO ?? '',
            ITEM: row.ITEM ?? row.ITEMNO ?? '',
            PARTNAME: row.PARTNAME ?? row.DESCRIPTION ?? '',
            DRAWING: row.DRAWING ?? '',
            VARIABLE: row.VARIABLE ?? row.PURCODE ?? '',
            QTY: row.QTY ?? 0,
            SCLNO: row.SCLNO ?? row.ISSUECARD ?? '',
            SCLTYPE: this.claimTypeCode(row.SCLTYPE ?? row.TYPE),
            SCHDNUM: row.PRODUCTION ?? row.SCHDNUM ?? '',
            SCHDP: row.ISSUESEQ ?? row.SCHDP ?? '',
            ISSUETO: row.ISSUETO ?? '',
            NEXTPROCESS: row.NEXTPROCESS ?? row.RETURNTO ?? '',
            REMARK: row.REMARKTABLE ?? row.REMARK ?? '',
        };
    }

    private claimTypeCode(value: string) {
        if (value === 'vendor') return '1';
        if (value === 'subcon') return '2';
        return ['1', '2'].includes(String(value || '')) ? String(value) : '';
    }

    private parseDetails(
        details?: CreatePsClmDetailDto[] | string,
    ): CreatePsClmDetailDto[] {
        if (!details) {
            throw new Error('DETAILS must contain at least one item');
        }
        const parsed =
            typeof details === 'string' ? JSON.parse(details) : details;
        if (!Array.isArray(parsed)) {
            throw new Error('DETAILS must be an array');
        }
        if (parsed.length === 0) {
            throw new Error('DETAILS must contain at least one item');
        }
        return parsed;
    }
}
