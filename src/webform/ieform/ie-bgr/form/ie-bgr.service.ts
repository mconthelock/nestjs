import { Injectable } from '@nestjs/common';
import {
    BGRQuotationDto,
    BGRReturnDto,
    CreateIeBgrDto,
    DraftIeBgrDto,
} from './dto/create-ie-bgr.dto';
import { ReportIeBgrDto, UpdateIeBgrDto } from './dto/update-ie-bgr.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, QueryRunner, Repository } from 'typeorm';
import { FormService } from 'src/webform/form/form.service';
import {
    deleteFile,
    joinPaths,
    moveFileFromMulter,
} from 'src/common/utils/files.utils';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { EbgreqformService } from 'src/ebudget/ebgreqform/ebgreqform.service';
import { EbgreqattfileService } from 'src/ebudget/ebgreqattfile/ebgreqattfile.service';
import { EbgreqcolImageService } from 'src/ebudget/ebgreqcol-image/ebgreqcol-image.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { EbudgetQuotationService } from 'src/ebudget/ebudget-quotation/ebudget-quotation.service';
import { EbudgetQuotationProductService } from 'src/ebudget/ebudget-quotation-product/ebudget-quotation-product.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { PprbiddingService } from 'src/amec/pprbidding/pprbidding.service';
import { MailService } from 'src/common/services/mail/mail.service';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { IEBGR_REPORT_VIEW } from 'src/common/Entities/webform/views/IEBGR_REPORT_VIEW.entity';
import { PpoService } from 'src/amec/ppo/ppo.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { FormCreateService } from 'src/webform/form/create-form.service';

@Injectable()
export class IeBgrService {
    constructor(
        @InjectRepository(IEBGR_REPORT_VIEW, 'webformConnection')
        private readonly reportRepo: Repository<IEBGR_REPORT_VIEW>,
        @InjectDataSource('webformConnection')
        private dataSource: DataSource,
        private readonly formmstService: FormmstService,
        private readonly ebudgetformService: EbgreqformService,
        private readonly ebudgetattfileService: EbgreqattfileService,
        private readonly ebudgetcolImageService: EbgreqcolImageService,
        private readonly ebudgetQuotationService: EbudgetQuotationService,
        private readonly ebudgetQuotationProductService: EbudgetQuotationProductService,
        private readonly ppoService: PpoService,
        protected readonly flowService: FlowService,
        private readonly formCreateService: FormCreateService,
        
        // create form
        protected readonly doactionFlowService: DoactionFlowService,
        
        // last approve
        protected readonly formService: FormService,
        protected readonly mailService: MailService,
        protected readonly pprbiddingService: PprbiddingService,
    ) {}

    protected readonly fileType = {
        imageI: 1,
        imageP: 2,
        imageD: 3,
        imageN: 4,
        imageE: 5,
        imageS: 6,
        fileP: 1,
        fileR: 2,
        fileS: 3,
        fileM: 4,
        fileE: 5,
        fileU: 6,
        fileO: 7,
    } as const;

    async report(dto: ReportIeBgrDto) {
        const where: any = {
            DEPT: dto.DEPT,
            EMPNO: dto.EMPNO,
            FORM_STATUS: dto.FORM_STATUS,
        };
        if (dto.FORMNO) {
            where.FORMNO = Like(`%${dto.FORMNO}%`);
        }
        const report = await this.reportRepo.find({
            where,
        });

        for (const r of report) {
            // const bidding = await this.pprbiddingService.search({
            //     EBUDGETNO: r.FORMNO,
            // });
            const bidding = await this.pprbiddingService.search({
                filters: [
                    { field: 'EBUDGETNO', op: 'eq', value: r.FORMNO },
                    { field: 'PR.NSTEP', op: 'notIn', value: [0, 99] },
                ],
            });
            let list = [];
            if (bidding.status) {
                for (const b of bidding.data) {
                    const po = await this.ppoService.search({
                        SREFNO: b.SPRNO,
                    });
                    if (po.length > 0) {
                        list.push({
                            SPRNO: b.SPRNO,
                            SPONO: po.map((p) => p.SPONO),
                        });
                    } else {
                        list.push({ SPRNO: b.SPRNO, SPONO: [] });
                    }
                }
            }
            r.prpo = list;
        }

        if (!dto.PRNO && !dto.PONO) return report;

        // กรองเฉพาะรายการที่ตรงกับ PRNO หรือ PONO ตามที่ระบุใน dto
        const filter = report.filter((r) => {
            // prpo: Array<{ SPRNO: string, SPONO: string[] }>
            const matched = r.prpo.filter(
                (p: { SPRNO: string; SPONO: string[] }) => {
                    if (dto.PRNO && dto.PONO) {
                        return (
                            p.SPRNO === dto.PRNO && p.SPONO.includes(dto.PONO)
                        );
                    }
                    if (dto.PRNO) {
                        return p.SPRNO === dto.PRNO;
                    }
                    if (dto.PONO) {
                        return p.SPONO.includes(dto.PONO);
                    }
                    return true;
                },
            );
            return matched.length > 0;
        });
        return filter;
    }

    // สร้าง Form มี 4 กรณี
    // 1. New Form
    // 2. Return Form
    // 3. Draft Form
    // 4. Save Form
    async createForm({
        dto,
        ip,
        isReturn = false,
        isDraft = false,
        isSave = false,
        Draft = '',
        queryRunner,
    }: {
        dto: UpdateIeBgrDto;
        ip: string;
        isReturn?: boolean;
        isDraft?: boolean;
        isSave?: boolean;
        Draft?: string;
        queryRunner?: QueryRunner;
    }) {
        try {
            let form: FormDto;

            if (isReturn) {
                // 1.1 กรณี Return ให้ทำการ Do Action เลย
                form = {
                    NFRMNO: dto.returnData.NFRMNO,
                    VORGNO: dto.returnData.VORGNO,
                    CYEAR: dto.returnData.CYEAR,
                    CYEAR2: dto.returnData.CYEAR2,
                    NRUNNO: dto.returnData.NRUNNO,
                };
                // 1.2 หากไม่ใช่การ save หรือก็คือการ return จริงๆ ให้ทำการ do action
                if (!isSave) {
                    await this.doactionFlowService.doAction(
                        {
                            ...form,
                            ACTION: dto.returnData.ACTION,
                            EMPNO: dto.returnData.EMPNO,
                            REMARK: dto.remark,
                        },
                        ip,
                    );
                } else {
                    // if(dto.remark != undefined){
                    this.flowService.updateFlow({
                        condition: {
                            ...form,
                            CSTEPNO: '--',
                        },
                        VREMARK: dto.remark ?? null,
                    });
                    // }
                }
            } else {
                // 1.3 กรณี New ให้สร้าง Form ใหม่
                const formmst =
                    await this.formmstService.getFormMasterByVaname('IE-BGR');
                const createCond: CreateFormDto = {
                    NFRMNO: formmst.NNO,
                    VORGNO: formmst.VORGNO,
                    CYEAR: formmst.CYEAR,
                    REQBY: dto.empRequest,
                    INPUTBY: dto.empInput,
                    REMARK: dto.remark,
                };
                // 1.4 กรณีเป็น Draft ให้เพิ่มค่า Draft เข้าไป
                if (isDraft) {
                    createCond.DRAFT = Draft;
                }
                const createForm = await this.formCreateService.create(
                    createCond,
                    ip,
                );

                if (!createForm.status) {
                    throw new Error(createForm.message.message);
                }

                form = {
                    NFRMNO: createForm.data.NFRMNO,
                    VORGNO: createForm.data.VORGNO,
                    CYEAR: createForm.data.CYEAR,
                    CYEAR2: createForm.data.CYEAR2,
                    NRUNNO: createForm.data.NRUNNO,
                };
            }
            return form;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // สร้าง path สำหรับเก็บไฟล์
    async createPath(form: FormDto, path: string) {
        const formNo = await this.formService.getFormno(form); // Get the form number
        const destination = path + '/' + formNo; // Get the destination path
        return destination;
    }

    // Insert EBGREQFORM
    // prettier-ignore
    async insertEbgreqform({dto, form}: {dto: CreateIeBgrDto | DraftIeBgrDto, form: FormDto}) {
        try {
            const avaliableBalance = dto.AVALIABLE_BALANCE ?? ((dto.REMBG - dto.REQAMT) || 0);
            const data = {
                ...form,
                ID: dto.BGTYPE,
                FYEAR: dto.FYEAR,
                SCATALOG: dto.SN,
                RECBG: dto.RECBG,
                USEDBG: dto.USEDBG,
                REMBG: dto.REMBG,
                REQAMT: dto.REQAMT,
                RESORG: dto.RESORG,
                PIC: dto.PIC,
                FINDATE: dto.FINDATE,
                ITMNAME: dto.ITMNAME,
                PURPOSE: dto.PURPOSE,
                DETPLAN: dto.DETPLAN,
                INVDET: dto.INVDET,
                EFFT: dto.EFFT,
                SCHEDULE: dto.SCHEDULE,
                REMARK: dto.REMARK,
                PPRESDATE: dto.PREDATE,
                GPBID: dto.GPBID || null,
                CASETYPE: dto.CASETYPE,
                AVALIABLE_BALANCE: avaliableBalance,
            };

        // Insert EBGREQFORM record
        return await this.ebudgetformService.create(data);
        }
        catch (error) {
        throw new Error(error.message);
        }
    }

    // จัดการไฟล์และรูปภาพ
    async insertFiles({
        isReturn,
        returnData,
        form,
        files,
        destination,
        movedTargets,
        returnDelFiles,
    }: {
        isReturn?: boolean;
        returnData?: BGRReturnDto;
        form: FormDto;
        files: Partial<
            Record<keyof typeof this.fileType, Express.Multer.File[]>
        >;
        destination: string;
        movedTargets: string[];
        returnDelFiles: string[];
    }) {
        try {
            if (isReturn) {
                // 1. ลบรูปภาพ
                if (returnData.delImage && returnData.delImage.length > 0) {
                    let colno = [];
                    for (const image of returnData.delImage) {
                        const cond = {
                            ...form,
                            COLNO: Number(image.colno),
                            ID: image.id,
                        };
                        const img =
                            await this.ebudgetcolImageService.findOne(cond);
                        if (img) {
                            returnDelFiles.push(
                                await joinPaths(destination, img.SFILE),
                            ); // เตรียมลบไฟล์ที่มีอยู่เดิม
                            await this.ebudgetcolImageService.delete({
                                condition: cond,
                            }); // ลบข้อมูลรูปภาพใน DB
                            colno.push(img.COLNO); // เก็บ colno ที่มีการลบไว้
                        }
                    }
                    colno = [...new Set(colno)]; // เอา colno ที่ซ้ำออก
                    for (const cn of colno) {
                        // 2. เรียงลำดับ ID ใหม่
                        const images = await this.ebudgetcolImageService.find({
                            ...form,
                            COLNO: cn,
                        });
                        const sortedImages = images.sort((a, b) => {
                            const aNum = parseInt(a.ID);
                            const bNum = parseInt(b.ID);
                            return aNum - bNum;
                        });
                        let newId = 0;
                        for (const img of sortedImages) {
                            await this.ebudgetcolImageService.update({
                                condition: {
                                    ...form,
                                    COLNO: cn,
                                    ID: img.ID,
                                },
                                ID: String(++newId),
                            });
                        }
                    }
                }
                // 3. ลบไฟล์แนบ
                if (returnData.delattach && returnData.delattach.length > 0) {
                    let typeno = [];
                    for (const f of returnData.delattach) {
                        const cond = {
                            ...form,
                            TYPENO: Number(f.typeno),
                            ID: f.id,
                        };
                        const file =
                            await this.ebudgetattfileService.findOne(cond);
                        if (file) {
                            returnDelFiles.push(
                                await joinPaths(destination, file.SFILE),
                            ); // เตรียมลบไฟล์ที่มีอยู่เดิม
                            await this.ebudgetattfileService.delete({
                                condition: cond,
                            }); // ลบข้อมูลรูปภาพใน DB
                            typeno.push(file.TYPENO); // เก็บ typeno ที่มีการลบไว้
                        }
                    }
                    typeno = [...new Set(typeno)]; // เอา typeno ที่ซ้ำออก
                    for (const cn of typeno) {
                        // 4. เรียงลำดับ ID ใหม่
                        const files = await this.ebudgetattfileService.find({
                            ...form,
                            TYPENO: cn,
                        });
                        const sortedFiles = files.sort((a, b) => {
                            const aNum = parseInt(a.ID);
                            const bNum = parseInt(b.ID);
                            return aNum - bNum;
                        });
                        let newId = 0;
                        for (const file of sortedFiles) {
                            await this.ebudgetattfileService.update({
                                condition: {
                                    ...form,
                                    TYPENO: cn,
                                    ID: file.ID,
                                },
                                ID: String(++newId),
                            });
                        }
                    }
                }
            }

            // 5. บันทึกไฟล์ และ รูปภาพ ลงในโฟลเดอร์ปลายทาง
            for (const key in files) {
                const raw = key.replace(
                    /\[\]$/,
                    '',
                ) as keyof typeof this.fileType; // รองรับกรณีที่ key เป็น array เช่น imageI[]
                const fileList = files[key];
                const data = key.startsWith('image')
                    ? await this.ebudgetcolImageService.find({
                          ...form,
                          COLNO: this.fileType[raw],
                      })
                    : await this.ebudgetattfileService.find({
                          ...form,
                          TYPENO: this.fileType[raw],
                      });
                let fileIndex = data.length; // เริ่มนับจากจำนวนไฟล์เดิม
                for (const file of fileList) {
                    const moved = await moveFileFromMulter({
                        file,
                        destination,
                    });
                    movedTargets.push(moved.path);
                    movedTargets.push(file.path);
                    // 6. บันทึกข้อมูลไฟล์ลงใน DB
                    if (key.startsWith('image') && fileList) {
                        await this.ebudgetcolImageService.insert({
                            ...form,
                            COLNO: this.fileType[raw],
                            ID: String(++fileIndex),
                            IMAGE_FILE: file.originalname.replace(
                                /[^a-zA-Z0-9.]/g,
                                '_',
                            ),
                            SFILE: moved.newName,
                        });
                    } else if (key.startsWith('file') && fileList) {
                        await this.ebudgetattfileService.insert({
                            ...form,
                            TYPENO: this.fileType[raw],
                            ID: String(++fileIndex),
                            SFILE: moved.newName,
                            OFILE: file.originalname.replace(
                                /[^a-zA-Z0-9.]/g,
                                '_',
                            ),
                        });
                    }
                }
            }
            return { movedTargets, returnDelFiles };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // บันทึก Quotation และ Quotation Product
    async insertQuotations({
        isReturn,
        returnData,
        form,
        quotation = [],
        createBy,
    }: {
        isReturn: boolean;
        returnData: BGRReturnDto;
        form: FormDto;
        quotation: BGRQuotationDto[];
        createBy: string;
    }) {
        try {
            // 1. กรณี Return ให้ทำการยกเลิก Quotation รอบก่อนทั้งหมดเพราะค่าเงินอาจมีการเปลี่ยนแปลง หากอยากได้ revision ให้ order by DATE_UPDATE
            if (isReturn) {
                const oldQuotations =
                    await this.ebudgetQuotationService.getData({
                        ...form,
                        STATUS: 1,
                    });
                // const rejectQuotation = oldQuotations.filter(o => {
                //     return !dto.quotation.find(n => n.QTA_FORM === o.QTA_FORM);
                // })

                for (const r of oldQuotations) {
                    await this.ebudgetQuotationService.update({
                        ID: r.ID,
                        STATUS: 0,
                        UPDATE_BY: returnData.EMPNO,
                    });
                }
            }
            // 2. บันทึก Quotation รอบใหม่
            for (const q of quotation) {
                const resQuo = await this.ebudgetQuotationService.insert({
                    ...form,
                    QTA_FORM: q.QTA_FORM,
                    QTA_VALID_DATE: q.QTA_VALID_DATE,
                    TOTAL: q.TOTAL,
                    CREATE_BY: createBy,
                });
                // 3. บันทึกข้อมูล Quotation Product
                if (!q.product) continue;
                for (const product of q.product) {
                    if (product.SEQ) {
                        await this.ebudgetQuotationProductService.insert({
                            QUOTATION_ID: resQuo.data.ID,
                            ...product,
                        });
                    }
                }
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
