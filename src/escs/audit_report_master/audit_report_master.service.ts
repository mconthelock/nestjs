import { Injectable } from '@nestjs/common';
import { CreateAuditReportMasterDto } from './dto/create-audit_report_master.dto';
import { UpdateAuditReportMasterDto } from './dto/update-audit_report_master.dto';
import { SearchAuditReportMasterDto } from './dto/search-audit_report_master.dto';
import { SaveAuditReportMasterDto } from './dto/save-audit_report_master.dto';

import { AuditReportRevisionService } from '../audit_report_revision/audit_report_revision.service';
import { DataAuditReportMasterDto } from './dto/data-audit_report_master.dto';
import { AuditReportHistoryService } from '../audit_report_history/audit_report_history.service';
import { AuditReportMasterRepository } from './audit_report_master.repository';

@Injectable()
export class AuditReportMasterService {
    constructor(
        private readonly repo: AuditReportMasterRepository,
        private readonly auditReportRevisionService: AuditReportRevisionService,
        private readonly auditReportHistoryService: AuditReportHistoryService,
    ) {}

    async getAuditReportMaster(dto: SearchAuditReportMasterDto) {
        const condition = { ...dto };
        if (dto.ARM_REV !== undefined) {
            condition.ARM_REV = dto.ARM_REV;
        } else {
            const lastRevision =
                await this.auditReportRevisionService.findLatestRevision(
                    dto.ARM_SECID,
                );
            if (lastRevision != null) {
                condition.ARM_REV = lastRevision.ARR_REV;
            }
        }
        if (dto.ARM_STATUS !== undefined) {
            condition.ARM_STATUS = dto.ARM_STATUS;
        }
        if (dto.ARM_SECID !== undefined) {
            condition.ARM_SECID = dto.ARM_SECID;
        }
        return await this.repo.find(condition);
    }

    async saveAuditReportMaster(dto: SaveAuditReportMasterDto) {
        try {
            const { topic, list, incharge, reason, secid, total } = dto;
            const currentData = await this.getAuditReportMaster({
                ARM_SECID: secid,
            });
            const revision = await this.auditReportRevisionService.create({
                ARR_SECID: secid,
                ARR_INCHARGE: incharge,
                ARR_REASON: reason,
                ARR_TOTAL: total,
            });
            for (const row of currentData) {
                await this.auditReportHistoryService.create({
                    ARH_SECID: row.ARM_SECID,
                    ARH_REV: row.ARM_REV,
                    ARH_NO: row.ARM_NO,
                    ARH_SEQ: row.ARM_SEQ,
                    ARH_TYPE: row.ARM_TYPE,
                    ARH_DETAIL: row.ARM_DETAIL,
                    ARH_FACTOR: row.ARM_FACTOR,
                    ARH_MAXSCORE: row.ARM_MAXSCORE,
                    ARH_STATUS: row.ARM_STATUS,
                });
            }

            if (topic.length > 0) {
                for (const t of topic) {
                    const data: any = await this.setData(t, revision.revision);
                    data.ARM_TYPE = 'H';
                    data.ARM_SEQ = 0;
                    data.ARM_SECID = secid;
                    if (t.type == 'del') {
                        await this.delete(data);
                    } else if (t.type == 'edit') {
                        await this.update({
                            ...data,
                            condition: {
                                ARM_REV: t.rev,
                                ARM_NO: t.topic,
                                ARM_SEQ: 0,
                                ARM_TYPE: 'H',
                            },
                        });
                    } else {
                        await this.create(data);
                    }
                }
            }
            if (list.length > 0) {
                for (const l of list) {
                    const data: any = await this.setData(l, revision.revision);
                    data.ARM_TYPE = 'D';
                    data.ARM_SECID = secid;
                    if (l.type == 'del') {
                        await this.delete(data);
                    } else if (l.type == 'edit') {
                        await this.update({
                            ...data,
                            condition: {
                                ARM_REV: l.rev,
                                ARM_NO: l.topic,
                                ARM_SEQ: l.seq,
                                ARM_TYPE: 'D',
                            },
                        });
                    } else {
                        await this.create(data);
                    }
                }
            }
            await this.update({
                ARM_REV: revision.revision,
                condition: { ARM_SECID: secid },
            });
            return {
                status: true,
                message: 'Save Successfully',
            };
        } catch (error) {
            throw new Error('Error: ' + error.message);
        }
    }

    async setData(dto: DataAuditReportMasterDto, revision: number) {
        const {
            rev,
            detail,
            type,
            status,
            topic,
            new_topic,
            seq,
            new_seq,
            factor,
            maxScore,
        } = dto;
        if (type == 'new') {
            return {
                ARM_REV: revision,
                ARM_NO: new_topic || topic,
                ARM_SEQ: new_seq || seq,
                ARM_DETAIL: detail,
                ARM_FACTOR: factor ?? 0,
                ARM_MAXSCORE: maxScore ?? 3,
            };
        } else if (type == 'edit') {
            return {
                ARM_REV: revision,
                ARM_NO: new_topic || topic,
                ARM_SEQ: new_seq || seq,
                ARM_STATUS: status,
                ARM_DETAIL: detail,
                ARM_FACTOR: factor ?? 0,
                ARM_MAXSCORE: maxScore ?? 3,
            };
        } else if (type == 'del') {
            return {
                ARM_REV: rev,
                ARM_NO: topic,
                ARM_SEQ: seq,
            };
        }
    }

    async create(dto: CreateAuditReportMasterDto) {
        try {
            const res = await this.repo.insert(dto);
            if (res.identifiers.length === 0) {
                throw new Error('No record inserted');
            }
            return {
                status: true,
                message: 'Insert Successfully',
            };
        } catch (error) {
            throw new Error('Insert master Error: ' + error.message);
        }
    }

    async update(dto: UpdateAuditReportMasterDto) {
        try {
            const res = await this.repo.update(dto);
            if (res.affected === 0) {
                throw new Error('No record updated');
            }
            return { status: true, message: 'Update master Successfully' };
        } catch (error) {
            throw new Error('Update master Error: ' + error.message);
        }
    }

    async delete(dto: UpdateAuditReportMasterDto) {
        try {
            const res = await this.repo.delete(dto);
            if (res.affected === 0) {
                throw new Error('No record deleted');
            }
            return { status: true, message: 'Delete master Successfully' };
        } catch (error) {
            throw new Error('Delete master Error: ' + error.message);
        }
    }
}
