import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as crypto from 'crypto';
import { PURPO_FORM } from 'src/common/Entities/webform/table/PURPO_FORM.entity';
import { PURPO_SYNC_OUTBOX } from 'src/common/Entities/webform/table/PURPO_SYNC_OUTBOX.entity';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';
import { FORMMST } from 'src/common/Entities/webform/table/FORMMST.entity';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { CreatePurPoDraftDto } from './dto/create-purpo-draft.dto';
import { SubmitPurPoDto } from './dto/submit-purpo.dto';
import { BatchActionPurPoDto, PurPoFormKeyDto } from './dto/batch-action-purpo.dto';
import { RecreatePurPoDto } from './dto/recreate-purpo.dto';

@Injectable()
export class PurPoService {
    private readonly logger = new Logger(PurPoService.name);

    constructor(
        @InjectDataSource('mitsuConnection')
        private readonly mitsuDs: DataSource,
        @InjectRepository(PURPO_FORM, 'mitsuConnection')
        private readonly purpoRepo: Repository<PURPO_FORM>,
        @InjectRepository(PURPO_SYNC_OUTBOX, 'mitsuConnection')
        private readonly outboxRepo: Repository<PURPO_SYNC_OUTBOX>,
        @InjectRepository(FORM, 'mitsuConnection')
        private readonly formRepo: Repository<FORM>,
        @InjectRepository(FLOW, 'mitsuConnection')
        private readonly flowRepo: Repository<FLOW>,
        @InjectRepository(FORMMST, 'mitsuConnection')
        private readonly formmstRepo: Repository<FORMMST>,
        private readonly formCreateService: FormCreateService,
        private readonly doactionFlowService: DoactionFlowService,
    ) {}

    private formatFormKey(k: PurPoFormKeyDto): string {
        return `${k.NFRMNO}-${k.VORGNO}-${k.CYEAR}-${k.CYEAR2}-${k.NRUNNO}`;
    }

    private buildFormUrl(baseUrl: string | null, k: PurPoFormKeyDto): string {
        const page =
            baseUrl || 'http://localhost/form/purform/PUR-PO/form/main';
        const sep = page.includes('?') ? '&' : '?';
        return `${page}${sep}no=${k.NFRMNO}&orgNo=${k.VORGNO}&y=${k.CYEAR}&y2=${k.CYEAR2}&runNo=${k.NRUNNO}`;
    }

    private async getPurPoFormMaster(): Promise<FORMMST> {
        const mst = await this.formmstRepo.findOne({
            where: { VANAME: 'PUR-PO', CSTATUS: '1' },
        });
        if (!mst) {
            throw new NotFoundException(
                "Form master 'PUR-PO' not found in WEBFORM.FORMMST",
            );
        }
        return mst;
    }

    /**
     * Auto-Create Draft Form (เรียกจาก backend-scm ตอน Import CSV หรือ Post-Approval Revise)
     */
    async createDraft(dto: CreatePurPoDraftDto, ip: string) {
        const mst = await this.getPurPoFormMaster();

        // Idempotency: check if a non-rejected form already exists for (ORD_ID, ORD_DOCREV)
        const existingList = await this.purpoRepo.find({
            where: {
                ORD_ID: dto.ordId,
                ORD_DOCREV: dto.ordDocRev,
            },
            order: { NRUNNO: 'DESC' },
        });

        for (const existing of existingList) {
            const existingForm = await this.formRepo.findOne({
                where: {
                    NFRMNO: existing.NFRMNO,
                    VORGNO: existing.VORGNO,
                    CYEAR: existing.CYEAR,
                    CYEAR2: existing.CYEAR2,
                    NRUNNO: existing.NRUNNO,
                },
            });
            if (existingForm && existingForm.CST !== '3') {
                const formKey: PurPoFormKeyDto = {
                    NFRMNO: existing.NFRMNO,
                    VORGNO: existing.VORGNO,
                    CYEAR: existing.CYEAR,
                    CYEAR2: existing.CYEAR2,
                    NRUNNO: existing.NRUNNO,
                };
                return {
                    status: true,
                    idempotent: true,
                    data: {
                        formKey,
                        formUrl: this.buildFormUrl(mst.VFORMPAGE, formKey),
                    },
                };
            }
        }

        const createRes: any = await this.formCreateService.create(
            {
                NFRMNO: mst.NNO,
                VORGNO: mst.VORGNO,
                CYEAR: mst.CYEAR,
                REQBY: dto.buyerEmpNo,
                INPUTBY: dto.buyerEmpNo,
                REMARK: dto.remark || '',
                DRAFT: '0',
            },
            ip,
        );

        if (!createRes?.status) {
            throw new BadRequestException(
                createRes?.message?.message ||
                    createRes?.message ||
                    'Failed to create PUR-PO draft form',
            );
        }

        const runNo = Number(createRes.data?.NRUNNO ?? createRes.NRUNNO);
        const cyear2 = String(
            createRes.data?.CYEAR2 ?? createRes.CYEAR2 ?? new Date().getFullYear(),
        );
        const now = new Date();

        const formKey: PurPoFormKeyDto = {
            NFRMNO: mst.NNO,
            VORGNO: mst.VORGNO,
            CYEAR: mst.CYEAR,
            CYEAR2: cyear2,
            NRUNNO: runNo,
        };

        await this.purpoRepo.save(
            this.purpoRepo.create({
                ...formKey,
                ORD_ID: dto.ordId,
                ORD_PONO: dto.ordPoNo,
                ORD_DOCREV: dto.ordDocRev,
                ORD_REVISION: dto.ordRevision ?? 0,
                ORD_TYPE: dto.ordType,
                VENDORCODE: dto.vendorCode,
                VENDOR_NAME: dto.vendorName || dto.vendorCode,
                ORD_AMOUNT: dto.ordAmount,
                ORD_CURRENCY: dto.ordCurrency || 'THB',
                BUYER_EMPNO: dto.buyerEmpNo,
                IS_REVISE: dto.isRevise ? 1 : 0,
                REMARK: dto.remark || null,
                CREATED_AT: now,
                UPDATED_AT: now,
            }),
        );

        return {
            status: true,
            idempotent: false,
            data: {
                formKey,
                formUrl: this.buildFormUrl(mst.VFORMPAGE, formKey),
            },
        };
    }

    /**
     * ดึงข้อมูล Header Form + Flow Status ของ PUR-PO
     */
    async getFormDetail(key: PurPoFormKeyDto) {
        const purpo = await this.purpoRepo.findOne({ where: key });
        if (!purpo) {
            throw new NotFoundException(
                `PUR-PO form ${this.formatFormKey(key)} not found`,
            );
        }

        const [form, flows] = await Promise.all([
            this.formRepo.findOne({ where: key }),
            this.flowRepo.find({
                where: key,
                order: { CSTEPNO: 'ASC' },
            }),
        ]);

        return {
            status: true,
            data: {
                purpo,
                form,
                flows,
            },
        };
    }

    /**
     * หน้า Batch Approve: ดึงรายการ PUR-PO ที่รอ Approver คนนี้ (รวมสิทธิ์แทน VREPNO)
     */
    async getPendingForApprover(empno: string) {
        if (!empno) {
            throw new BadRequestException('empno is required');
        }

        const readyFlows = await this.flowRepo
            .createQueryBuilder('fl')
            .where('fl.CSTEPST = :ready', { ready: '3' })
            .andWhere('(fl.VAPVNO = :empno OR fl.VREPNO = :empno)', { empno })
            .getMany();

        if (readyFlows.length === 0) {
            return { status: true, data: [] };
        }

        const results: Array<{
            formKey: PurPoFormKeyDto;
            purpo: PURPO_FORM;
            formStatus: string;
            stepNo: string;
            assignedApprover: string;
        }> = [];

        for (const fl of readyFlows) {
            const key: PurPoFormKeyDto = {
                NFRMNO: fl.NFRMNO,
                VORGNO: fl.VORGNO,
                CYEAR: fl.CYEAR,
                CYEAR2: fl.CYEAR2,
                NRUNNO: fl.NRUNNO,
            };
            const purpo = await this.purpoRepo.findOne({ where: key });
            if (!purpo) continue;

            const form = await this.formRepo.findOne({ where: key });
            if (!form || form.CST !== '1') continue;

            results.push({
                formKey: key,
                purpo,
                formStatus: form.CST,
                stepNo: fl.CSTEPNO,
                assignedApprover: fl.VAPVNO,
            });
        }

        results.sort(
            (a, b) =>
                new Date(a.purpo.CREATED_AT || 0).getTime() -
                new Date(b.purpo.CREATED_AT || 0).getTime(),
        );

        return { status: true, data: results };
    }

    /**
     * Buyer กด Submit จาก Draft หรือ Return -> ส่งเข้าสายอนุมัติ + Sync กลับ backend-scm
     */
    async submitForm(dto: SubmitPurPoDto, ip: string) {
        const key: PurPoFormKeyDto = {
            NFRMNO: dto.NFRMNO,
            VORGNO: dto.VORGNO,
            CYEAR: dto.CYEAR,
            CYEAR2: dto.CYEAR2,
            NRUNNO: dto.NRUNNO,
        };

        const purpo = await this.purpoRepo.findOne({ where: key });
        if (!purpo) {
            throw new NotFoundException(
                `PUR-PO form ${this.formatFormKey(key)} not found`,
            );
        }

        const form = await this.formRepo.findOne({ where: key });
        if (!form) {
            throw new NotFoundException('Webform record not found');
        }

        const now = new Date();
        if (dto.ordAmount !== undefined) {
            purpo.ORD_AMOUNT = dto.ordAmount;
        }
        if (dto.REMARK !== undefined) {
            purpo.REMARK = dto.REMARK;
        }
        purpo.UPDATED_AT = now;
        await this.purpoRepo.save(purpo);

        if (form.CST === '0') {
            // Transition Draft -> On-going: mark CST='1' and activate the start step
            await this.formRepo.update(key, {
                CST: '1',
                VREMARK: dto.REMARK ?? form.VREMARK,
            });
            const flows = await this.flowRepo.find({ where: key });
            const startFlow =
                flows.find((f) => f.CSTEPST === '2') ||
                flows.find((f) => f.CSTART === '1');
            if (startFlow) {
                await this.flowRepo.update(
                    { ...key, CSTEPNO: startFlow.CSTEPNO },
                    { CSTEPST: '3' },
                );
            }
        } else {
            // Re-submit after Return
            const actionRes = await this.doactionFlowService.doAction(
                {
                    ...key,
                    ACTION: 'approve',
                    EMPNO: dto.EMPNO,
                    REMARK: dto.REMARK || '',
                } as any,
                ip,
            );
            if (!actionRes?.status) {
                throw new BadRequestException(
                    actionRes?.message || 'Failed to resubmit returned form',
                );
            }
        }

        const eventId = await this.enqueueOutboxEvent({
            key,
            ordId: purpo.ORD_ID,
            eventType: 'SUBMITTED',
            actorEmpNo: dto.EMPNO,
            remark: dto.REMARK || 'Submitted by Buyer',
        });

        const sync = await this.dispatchOutboxEvent(eventId);
        return {
            status: true,
            data: {
                formKey: key,
                ordId: purpo.ORD_ID,
                sync,
            },
        };
    }

    /**
     * Approver กด Approve / Return / Reject ทีละ 1 ใบ หรือหลายใบพร้อมกัน (Batch Approve)
     */
    async batchAction(dto: BatchActionPurPoDto, ip: string) {
        const succeeded: Array<Record<string, unknown>> = [];
        const failed: Array<Record<string, unknown>> = [];

        for (const key of dto.items) {
            const formKeyStr = this.formatFormKey(key);
            const qr = this.mitsuDs.createQueryRunner();
            await qr.connect();
            await qr.startTransaction();

            let pendingEventId: string | null = null;
            let ordId = 0;

            try {
                const purpo = await qr.manager.findOne(PURPO_FORM, {
                    where: key,
                });
                if (!purpo) {
                    throw new NotFoundException(`PUR-PO ${formKeyStr} not found`);
                }
                ordId = purpo.ORD_ID;

                const actionRes = await this.doactionFlowService.doAction(
                    {
                        ...key,
                        ACTION: dto.action,
                        EMPNO: dto.empno,
                        REMARK: dto.remark || '',
                    } as any,
                    ip,
                );
                if (!actionRes?.status) {
                    throw new Error(actionRes?.message || 'Flow action failed');
                }

                const updatedForm = await qr.manager.findOne(FORM, {
                    where: key,
                });

                let eventType: 'APPROVED' | 'RETURNED' | 'REJECTED' | null = null;
                if (dto.action === 'approve' && updatedForm?.CST === '2') {
                    eventType = 'APPROVED';
                } else if (dto.action === 'return') {
                    eventType = 'RETURNED';
                } else if (dto.action === 'reject' || updatedForm?.CST === '3') {
                    eventType = 'REJECTED';
                }

                if (eventType) {
                    pendingEventId = crypto.randomUUID();
                    const payload = {
                        eventId: pendingEventId,
                        ordId: purpo.ORD_ID,
                        formKey: formKeyStr,
                        nfrmno: key.NFRMNO,
                        vorgno: key.VORGNO,
                        cyear: key.CYEAR,
                        cyear2: key.CYEAR2,
                        nrunno: key.NRUNNO,
                        eventType,
                        actorEmpNo: dto.empno,
                        remark: dto.remark || '',
                        actionAt: new Date().toISOString(),
                    };

                    await qr.manager.save(
                        PURPO_SYNC_OUTBOX,
                        qr.manager.create(PURPO_SYNC_OUTBOX, {
                            EVENT_ID: pendingEventId,
                            ...key,
                            ORD_ID: purpo.ORD_ID,
                            EVENT_TYPE: eventType,
                            PAYLOAD_JSON: JSON.stringify(payload),
                            STATUS: 'PENDING',
                            RETRY_COUNT: 0,
                            CREATED_AT: new Date(),
                        }),
                    );
                }

                await qr.commitTransaction();

                let syncResult: Record<string, unknown> = {
                    synced: true,
                    note: 'Intermediate step approved; waiting for next approver',
                };
                if (pendingEventId) {
                    syncResult = await this.dispatchOutboxEvent(pendingEventId);
                }

                succeeded.push({
                    formKey: key,
                    ordId,
                    action: dto.action,
                    finalFormStatus: updatedForm?.CST,
                    sync: syncResult,
                });
            } catch (err: any) {
                if (qr.isTransactionActive) {
                    await qr.rollbackTransaction();
                }
                failed.push({
                    formKey: key,
                    ordId,
                    error: err?.message || String(err),
                });
            } finally {
                await qr.release();
            }
        }

        return {
            status: failed.length === 0,
            data: {
                total: dto.items.length,
                succeededCount: succeeded.length,
                failedCount: failed.length,
                succeeded,
                failed,
            },
        };
    }

    /**
     * กรณี Reject แล้ว Buyer ต้องการแก้ไขและส่งขออนุมัติใหม่ (สร้าง Form ใหม่ผูก ORD_ID เดิม ไม่เพิ่ม ORD_REVISION)
     */
    async recreateFromRejected(dto: RecreatePurPoDto, ip: string) {
        const oldKey: PurPoFormKeyDto = {
            NFRMNO: dto.NFRMNO,
            VORGNO: dto.VORGNO,
            CYEAR: dto.CYEAR,
            CYEAR2: dto.CYEAR2,
            NRUNNO: dto.NRUNNO,
        };

        const oldForm = await this.formRepo.findOne({ where: oldKey });
        if (!oldForm || oldForm.CST !== '3') {
            throw new BadRequestException(
                'Can only recreate a new form from a REJECTED (CST=3) form',
            );
        }

        const oldPurpo = await this.purpoRepo.findOne({ where: oldKey });
        if (!oldPurpo) {
            throw new NotFoundException('Original PUR-PO form data not found');
        }

        return this.createDraft(
            {
                ordId: oldPurpo.ORD_ID,
                ordPoNo: oldPurpo.ORD_PONO,
                ordDocRev: oldPurpo.ORD_DOCREV,
                ordRevision: oldPurpo.ORD_REVISION,
                ordType: oldPurpo.ORD_TYPE,
                vendorCode: oldPurpo.VENDORCODE,
                vendorName: oldPurpo.VENDOR_NAME || oldPurpo.VENDORCODE,
                ordAmount: Number(oldPurpo.ORD_AMOUNT),
                ordCurrency: oldPurpo.ORD_CURRENCY,
                buyerEmpNo: dto.empno,
                isRevise: oldPurpo.IS_REVISE === 1,
                remark: dto.remark || oldPurpo.REMARK || '',
            },
            ip,
        );
    }

    private async enqueueOutboxEvent(params: {
        key: PurPoFormKeyDto;
        ordId: number;
        eventType: 'SUBMITTED' | 'APPROVED' | 'RETURNED' | 'REJECTED';
        actorEmpNo: string;
        remark: string;
    }): Promise<string> {
        const eventId = crypto.randomUUID();
        const formKeyStr = this.formatFormKey(params.key);
        const payload = {
            eventId,
            ordId: params.ordId,
            formKey: formKeyStr,
            nfrmno: params.key.NFRMNO,
            vorgno: params.key.VORGNO,
            cyear: params.key.CYEAR,
            cyear2: params.key.CYEAR2,
            nrunno: params.key.NRUNNO,
            eventType: params.eventType,
            actorEmpNo: params.actorEmpNo,
            remark: params.remark,
            actionAt: new Date().toISOString(),
        };

        await this.outboxRepo.save(
            this.outboxRepo.create({
                EVENT_ID: eventId,
                ...params.key,
                ORD_ID: params.ordId,
                EVENT_TYPE: params.eventType,
                PAYLOAD_JSON: JSON.stringify(payload),
                STATUS: 'PENDING',
                RETRY_COUNT: 0,
                CREATED_AT: new Date(),
            }),
        );
        return eventId;
    }

    async dispatchOutboxEvent(eventId: string) {
        const record = await this.outboxRepo.findOne({
            where: { EVENT_ID: eventId },
        });
        if (!record || record.STATUS === 'SYNCED') {
            return { synced: true, eventId };
        }

        const scmApiUrl = (
            process.env.SCM_API_URL || 'http://localhost:3002'
        ).replace(/\/$/, '');
        const internalKey =
            process.env.INTERNAL_API_KEY || 'amec-scm-internal-dev-key';

        try {
            const res = await fetch(
                `${scmApiUrl}/api/v1/internal/orders/approval-callback`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-internal-api-key': internalKey,
                    },
                    body: record.PAYLOAD_JSON,
                },
            );

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`HTTP ${res.status}: ${errText.slice(0, 500)}`);
            }

            record.STATUS = 'SYNCED';
            record.SYNCED_AT = new Date();
            record.LAST_ERROR = null;
            await this.outboxRepo.save(record);

            return { synced: true, eventId };
        } catch (err: any) {
            record.RETRY_COUNT = Number(record.RETRY_COUNT || 0) + 1;
            record.LAST_ERROR = String(err?.message || err).slice(0, 1000);
            if (record.RETRY_COUNT >= 20) {
                record.STATUS = 'FAILED';
            }
            await this.outboxRepo.save(record);
            this.logger.warn(
                `PURPO outbox ${eventId} dispatch failed (retry #${record.RETRY_COUNT}): ${record.LAST_ERROR}`,
            );
            return { synced: false, eventId, error: record.LAST_ERROR };
        }
    }

    async processPendingOutbox(limit = 20) {
        const pending = await this.outboxRepo.find({
            where: { STATUS: 'PENDING' },
            order: { CREATED_AT: 'ASC' },
            take: limit,
        });

        const results: Array<{ eventId: string; synced: boolean; error?: string }> =
            [];
        for (const item of pending) {
            const res = await this.dispatchOutboxEvent(item.EVENT_ID);
            results.push({
                eventId: item.EVENT_ID,
                synced: res.synced,
                error: res.error,
            });
        }
        return {
            status: true,
            data: { checked: pending.length, results },
        };
    }
}
