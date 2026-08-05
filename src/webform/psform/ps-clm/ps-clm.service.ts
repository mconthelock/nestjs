import { Injectable } from '@nestjs/common';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { UsersService } from 'src/amec/users/users.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { ConectionService } from 'src/as400/conection/conection.service';
import { M001kpService } from 'src/as400/rtnlibf/m001kp/m001kp.service';
import { M002kpService } from 'src/as400/rtnlibf/m002kp/m002kp.service';
import { PSCLM_DETAIL } from 'src/common/Entities/webform/table/PSCLM_DETAIL.entity';
import { MailService } from 'src/common/services/mail/mail.service';
import { HandleFileFormService } from 'src/webform/handle-file-form/handle-file-form.service';
import {
    CreatePsClmDetailDto,
    CreatePsClmReqFormDto,
} from './dto/create-ps-clm.dto';
import { SendPsClmAs400Dto, UpdatePsClmDto } from './dto/update-ps-clm.dto';
import { PsClmRepository } from './ps-clm.repository';

const ASSIGN_CONTROLLERS = ['12177', '14036', '16066'];
const ORDER_PREFIXES = { E: 'ET2C', S: 'ST2C' } as const;
const AS400_PRIMARY_LIBRARY = 'RTNLIBF';
const AS400_DEBUG_LIBRARY = 'DBGDEV14';
const M002_TABLE = 'M002KPBM';

function getOrderType(orderNo: string) {
    const type = String(orderNo || '')
        .trim()
        .charAt(0)
        .toUpperCase();
    return type === 'E' || type === 'S' ? type : '';
}

export function formatPsClmOrderNo(orderNo: string, sequence: number) {
    const type = getOrderType(orderNo);
    const prefix = ORDER_PREFIXES[type];
    if (!prefix) return '';

    const index = sequence - 1;
    const suffix =
        type === 'E'
            ? `${letterAt(Math.floor(index / 999))}${String((index % 999) + 1).padStart(3, '0')}`
            : `${letterAt(Math.floor(index / 234))}0${letterAt(Math.floor(index / 9) % 26)}${(index % 9) + 1}`;
    return addOrderCheckBit(`${prefix}${suffix}`);
}

export function nextPsClmOrderNo(
    orderNo: string,
    usedOrders: Iterable<string>,
) {
    const type = getOrderType(orderNo);
    if (!ORDER_PREFIXES[type]) return '';

    const used = new Set(usedOrders);
    const limit = type === 'E' ? 26 * 999 : 26 * 234;
    for (let sequence = 1; sequence <= limit; sequence++) {
        const candidate = formatPsClmOrderNo(orderNo, sequence);
        if (!used.has(candidate)) return candidate;
    }
    throw new Error(`New order number range for ${type} is full`);
}

export function formatPsClmProject(
    claimSlipNo: string,
    claimTypes: Iterable<string>,
) {
    const types = [...new Set(claimTypes)];
    if (types.length !== 1 || !['1', '2'].includes(types[0])) {
        throw new Error('All details must use one Claim Type');
    }
    return `${String(claimSlipNo).trim().toUpperCase()} ${types[0] === '1' ? '#VENDOR' : '#SUBCON'}`;
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
    private readonly as400PrimaryLibrary = AS400_PRIMARY_LIBRARY;
    private readonly as400WriteLibraries = [
        ...new Set([this.as400PrimaryLibrary, AS400_DEBUG_LIBRARY]),
    ];

    constructor(
        private readonly repo: PsClmRepository,
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
        private readonly doactionService: DoactionFlowService,
        private readonly flowService: FlowService,
        private readonly usersService: UsersService,
        private readonly as400: ConectionService,
        private readonly m001kpService: M001kpService,
        private readonly m002kpService: M002kpService,
        private readonly mailService: MailService,
        private readonly handleFileFormService: HandleFileFormService,
    ) {}

    async create(
        dto: CreatePsClmReqFormDto,
        files: Express.Multer.File[],
        ip: string,
    ) {
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
                (detail) => ORDER_PREFIXES[getOrderType(detail.ORDERNO)],
            )?.ORDERNO || '',
        );
        if (!originalOrder) {
            throw new Error('Original Order must start with E or S');
        }

        await this.repo.lockForms();
        const type = getOrderType(originalOrder);
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
        const attachments = files?.length
            ? await this.handleFileFormService.insertFiles(
                  {
                      ...form,
                      FORM_TYPE: 'PS',
                      CREATEBY: dto.INPUTBY || dto.REQBY,
                  },
                  files,
              )
            : null;
        await this.mailService.sendMail(
            await this.getRequestMail(form, dto.REQBY, newOrderNo),
        );

        return {
            status: true,
            message: 'PS-CLM form created successfully',
            data: {
                form,
                psclmForm,
                list,
                attachments,
                NEWORDER: newOrderNo,
            },
        };
    }

    async nextOrder(orderNo: string) {
        const type = getOrderType(orderNo);
        if (!ORDER_PREFIXES[type]) {
            throw new Error('Original Order must start with E or S');
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

    async previewAs400(dto: SendPsClmAs400Dto) {
        const {
            newOrder,
            details,
            originalOrder,
            schedule,
            priority,
            claimSlipNo,
        } = await this.getAs400WriteContext(dto);

        const related = await this.m002kpService.previewInsert(
            originalOrder,
            newOrder,
            schedule,
            priority,
            claimSlipNo,
        );
        const m001 = this.m001kpService.previewInsert(newOrder, details);

        return {
            status: true,
            message: `Preview only: no data was written to ${this.as400WriteLibraries.join(' or ')}`,
            data: {
                libraries: this.as400WriteLibraries,
                m001,
                ...related,
            },
        };
    }

    async sendToAs400(dto: SendPsClmAs400Dto) {
        const {
            newOrder,
            details,
            originalOrder,
            schedule,
            priority,
            claimSlipNo,
        } = await this.getAs400WriteContext(dto);
        await this.updateDetailSchedules(this.pickForm(dto), dto.DETAILS);

        const result = await this.as400.withTransaction(async (connection) => {
            const related = await this.m002kpService.copyToLibraries(
                connection,
                originalOrder,
                newOrder,
                schedule,
                priority,
                claimSlipNo,
                this.as400WriteLibraries,
            );
            const m001 = await this.m001kpService.addToLibraries(
                connection,
                newOrder,
                details,
                this.as400WriteLibraries,
            );
            return { m001, ...related };
        });

        return {
            status: true,
            message: `${newOrder} sent to ${this.as400WriteLibraries.join(' and ')} successfully`,
            data: result,
        };
    }

    async checkAs400Order(dto: SendPsClmAs400Dto) {
        const { originalOrder } = await this.getAs400PreviewContext(dto);
        const rows = await this.m002kpService.checkOrder(originalOrder);
        return {
            status: true,
            message: rows.length
                ? `Order found in ${this.as400PrimaryLibrary}.${M002_TABLE}`
                : `Order not found in ${this.as400PrimaryLibrary}.${M002_TABLE}`,
            data: {
                library: `${this.as400PrimaryLibrary}.${M002_TABLE}`,
                condition: `M2K02 = ${originalOrder}`,
                rows,
            },
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

    private async getAs400PreviewContext(dto: SendPsClmAs400Dto) {
        const form = this.pickForm(dto);
        const ready = await this.flowService.getEmpFlowStepReady({
            ...form,
            EMPNO: dto.EMPNO,
        });
        if (
            !ready.some((flow) => String(flow.CEXTDATA || '').trim() === '02')
        ) {
            throw new Error('Only the assigned controller can check AS400');
        }

        const data = await this.repo.findOneWithList(form);
        const details = this.parseDetails(dto.DETAILS).map((detail) =>
            this.toDetailEntity(form, detail),
        ) as PSCLM_DETAIL[];
        const originalOrders = [
            ...new Set(
                details.map((detail) =>
                    String(detail.ORDERNO || '')
                        .trim()
                        .toUpperCase(),
                ),
            ),
        ].filter(Boolean);
        if (originalOrders.length !== 1) {
            throw new Error('All details must use one Original Order');
        }
        return {
            newOrder: String(data?.NEWORDER || '')
                .trim()
                .toUpperCase(),
            details,
            originalOrder: originalOrders[0],
        };
    }

    private async getAs400WriteContext(dto: SendPsClmAs400Dto) {
        const context = await this.getAs400PreviewContext(dto);
        if (!context.newOrder) throw new Error('New Order not found');
        if (
            context.details.some(
                (detail) =>
                    !/^[A-Z0-9]{5}$/i.test(
                        String(detail.SCHDNUM || '').trim(),
                    ) || !/^P\d+$/i.test(String(detail.SCHDP || '').trim()),
            )
        ) {
            throw new Error('Schedule and P are required for every item');
        }
        const schedules = [
            ...new Set(
                context.details.map((detail) =>
                    String(detail.SCHDNUM).trim().toUpperCase(),
                ),
            ),
        ];
        const priorities = [
            ...new Set(
                context.details.map((detail) =>
                    String(detail.SCHDP).trim().toUpperCase(),
                ),
            ),
        ];
        if (schedules.length !== 1 || priorities.length !== 1) {
            throw new Error('All details must use one Schedule and P');
        }
        const claimSlipNumbers = [
            ...new Set(
                context.details.map((detail) =>
                    String(detail.SCLNO || '').trim(),
                ),
            ),
        ].filter(Boolean);
        if (claimSlipNumbers.length !== 1) {
            throw new Error('All details must use one Claim Slip No.');
        }
        const claimTypes = context.details
            .map((detail) => String(detail.SCLTYPE || '').trim())
            .filter(Boolean);
        return {
            ...context,
            schedule: schedules[0],
            priority: priorities[0],
            claimSlipNo: formatPsClmProject(claimSlipNumbers[0], claimTypes),
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

    private async getRequestMail(
        form: FormDto,
        requester: string,
        newOrder: string,
    ) {
        const empno = String(requester || '').trim();
        const user = empno && (await this.usersService.findEmp(empno));
        if (!user?.SRECMAIL)
            throw new Error(`PS-CLM email not found for requester: ${empno}`);

        const cc = await this.getRequestMailCc(form, user.SRECMAIL);

        const formNo = `PS-CLM${String(form.CYEAR2).slice(-2)}-${String(form.NRUNNO).padStart(6, '0')}`;
        return {
            to: user.SRECMAIL,
            cc,
            subject: `${formNo} created`,
            html: `<p>${formNo} has been created.</p><p>New Order: ${newOrder}</p><p>This is an automated email.</p>`,
        };
    }

    private async getRequestMailCc(form: FormDto, requesterEmail: string) {
        const flows = (
            await Promise.all(
                ['01', '02'].map((CEXTDATA) =>
                    this.flowService.getFlow({ ...form, CEXTDATA }),
                ),
            )
        ).flat();
        const empnos = [
            ...new Set(
                flows
                    .flatMap((flow) => [flow.VAPVNO, flow.VREPNO])
                    .map((empno) => String(empno || '').trim())
                    .filter(Boolean),
            ),
        ];
        const users = await Promise.all(
            empnos.map((empno) => this.usersService.findEmp(empno)),
        );
        const requester = requesterEmail.trim().toLowerCase();

        return [
            ...new Map(
                users
                    .map((user) => String(user?.SRECMAIL || '').trim())
                    .filter(
                        (email) =>
                            email && email.toLowerCase() !== requester,
                    )
                    .map((email) => [email.toLowerCase(), email]),
            ).values(),
        ];
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
