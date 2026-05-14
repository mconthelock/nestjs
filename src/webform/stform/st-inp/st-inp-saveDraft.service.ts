import { Injectable } from '@nestjs/common';
import { StInpService } from './st-inp.service';
import {
    CorrectiveStInpDetailDto,
    CorrectiveStInpDto,
} from './dto/corrective-st-inp.dto';
import { FlowService } from 'src/webform/flow/flow.service';
import { StyTypeService } from 'src/gpreport/sty-type/sty-type.service';
import { StyImageService } from 'src/gpreport/sty-image/sty-image.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { FormService } from 'src/webform/form/form.service';
import { StinpFormListService } from 'src/gpreport/stinp-form-list/stinp-form-list.service';
import { StinpFormService } from 'src/gpreport/stinp-form/stinp-form.service';
import { DraftStInpDto } from './dto/create-st-inp.dto';

@Injectable()
export class StInpSaveDraftService extends StInpService {
    constructor(
        protected readonly createFormService: FormCreateService,
        protected readonly formmstService: FormmstService,
        protected readonly styImageService: StyImageService,
        protected readonly styTypeService: StyTypeService,
        protected readonly flowService: FlowService,
        protected readonly formService: FormService,
        protected readonly stinpFormService: StinpFormService,
        protected readonly stinpFormListService: StinpFormListService,
        private readonly doactionService: DoactionFlowService,
    ) {
        super(
            createFormService,
            formmstService,
            styImageService,
            styTypeService,
            flowService,
            formService,
            stinpFormService,
            stinpFormListService,
        );
    }

    async saveDraft(
        dto: DraftStInpDto,
        ip: string,
        files: Express.Multer.File[],
        path: string,
    ) {
        try {
            let flagReset = false;
            const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ

            const styType = await this.styTypeService.findByTypeCode('PT');
            if (!styType.status) {
                throw new Error('STY Type not found for code PT');
            }
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };
            const formno = await this.formService.getFormno(form);
            const formData = await this.stinpFormService.findOne(form);
            if (!formData) {
                throw new Error('Form data not found for given identifiers');
            }
            // ตรวจสอบว่ามีการเปลี่ยนแปลงผู้รับผิดชอบหรือไม่ ถ้ามีให้ set flag เพื่อ reset flow ในภายหลัง และทำการเปลี่ยนแปลงผู้รับผิดชอบใน flow ทันทีเพื่อให้ถูกต้องก่อนบันทึกข้อมูลอื่นๆ เพราะผู้รับผิดชอบจะเป็นคน approve ต่อไป
            if (formData.data.VOWNER !== dto.PA_OWNER) {
                flagReset = true;
                await this.setOwnerFlow(form, dto.PA_OWNER);
            }
            // update ข้อมูลฟอร์มหลักก่อน เพราะข้อมูลใน list จะต้องอ้างอิงกับฟอร์มหลักเสมอ   
            await this.stinpFormService.update(form, {
                VOWNER: dto.PA_OWNER,
                DDATE: dto.PA_DATE,
                VSECTION: dto.PA_SECTION,
                VAUDIT: dto.PA_AUDIT,
            });

            const list = await this.stinpFormListService.find(form);
            // ถ้าไม่มีรายการเลย และมีรายการเดิมอยู่ ให้ลบรายการเดิมทั้งหมด (กรณีที่ผู้ใช้ลบรายการในฟอร์มจนหมด)
            if (!dto.PA_LIST || dto.PA_LIST.length === 0) {
                if (list.status) {
                    for (const l of list.data) {
                        await this.stinpFormListService.delete({
                            ...form,
                            NID: l.NID,
                        });
                        await this.styImageService.delete(l.NIMAGE); // ลบไฟล์เก่า
                    }
                }
            } else {
                const listIds: number[] = [];
                const listDelImg: number[] = [];
                for (const newlist of dto.PA_LIST) {
                    const index = dto.PA_LIST.indexOf(newlist);
                    // insert and move image
                    const movedFile =
                        await this.styImageService.moveAndInsertFiles({
                            file: files[index],
                            path,
                            userCreate: dto.EMPNO,
                            typeId: styType.data[0].TYPE_ID,
                            folder: formno,
                        });
                    movedTargets.push(...movedFile.path);
                    // ถ้ามี PA_ID แสดงว่าเป็นรายการที่มีอยู่แล้ว ให้ update แต่ถ้าไม่มี PA_ID แสดงว่าเป็นรายการใหม่ ให้ create
                    listIds.push(index + 1);
                    if (newlist.PA_ID) {
                        // listIds.push(newlist.PA_ID);
                        // ถ้าเป็นรายการที่มีอยู่แล้ว ให้ลบไฟล์เก่าแล้ว update ด้วยไฟล์ใหม่
                        const existing =
                            await this.stinpFormListService.findOne({
                                ...form,
                                NID: newlist.PA_ID,
                            });
                        if (!existing.status) {
                            throw new Error(
                                `Form list item not found with ID: ${newlist.PA_ID}`,
                            ); // ป้องกันกรณีที่มี PA_ID แต่ไม่เจอใน DB
                        }
                        if(!listDelImg.includes(existing.data.NIMAGE)) {
                            listDelImg.push(existing.data.NIMAGE); // เก็บไฟล์เก่าไว้ลบทีหลัง
                        }
                         const existingOld =
                            await this.stinpFormListService.findOne({
                                ...form,
                                NID: index + 1,
                            });
                        if (existingOld.status && !listDelImg.includes(existingOld.data.NIMAGE)) {
                            listDelImg.push(existingOld.data.NIMAGE); // เก็บไฟล์เก่าไว้ลบทีหลัง
                        }
                        // update ข้อมูลแถวใหม่
                        await this.stinpFormListService.update(
                            { ...form, NID: index+1 },
                            {
                                NITEM: newlist.PA_ITEMS,
                                VAREA: newlist.PA_AREA,
                                VDETECTED: newlist.PA_DETECTED,
                                NCLASS: newlist.PA_CLASS,
                                VSUGGESTION: newlist.PA_SUGGESTION || null,
                                NMAT: newlist.PA_MAT,
                                NIMAGE: movedFile.data.IMAGE_ID,
                            },
                        );
                    } else {
                        // ตรวจสอบกรณีที่เปลี่ยนรูปแต่ยังมีข้อมูลอยู่ ให้ลบไฟล์เก่า
                        const existing =
                            await this.stinpFormListService.findOne({
                                ...form,
                                NID: index + 1,
                            });
                        if (existing.status && !listDelImg.includes(existing.data.NIMAGE)) {
                            listDelImg.push(existing.data.NIMAGE); // เก็บไฟล์เก่าไว้ลบทีหลัง
                        }
                        // ถ้าเป็นรายการใหม่ ให้สร้างแถวใหม่ด้วย NID ที่เพิ่มขึ้นจากแถวสุดท้ายในที่นี้หากมี primary key มันจะ update
                        await this.stinpFormListService.create({
                            ...form,
                            NID: index + 1,
                            NITEM: newlist.PA_ITEMS,
                            VAREA: newlist.PA_AREA,
                            VDETECTED: newlist.PA_DETECTED,
                            NCLASS: newlist.PA_CLASS,
                            VSUGGESTION: newlist.PA_SUGGESTION || null,
                            NMAT: newlist.PA_MAT,
                            NIMAGE: movedFile.data.IMAGE_ID,
                        });
                        
                    }
                }
                if (list.status) {
                    // ลบรายการที่ถูกลบออกจากฟอร์ม โดยตรวจสอบจาก NID ที่ส่งมาว่ายังมีอยู่ไหม ถ้าไม่มีแสดงว่าถูกลบไปแล้ว ให้ลบออกจาก DB และลบไฟล์ด้วย
                    const diff = list.data.filter(
                        (x) => !listIds.includes(x.NID),
                    );
                    for (const d of diff) {
                        await this.stinpFormListService.delete({
                            ...form,
                            NID: d.NID,
                        });
                        await this.styImageService.delete(d.NIMAGE); // ลบไฟล์เก่า
                    }
                    for (const imgId of listDelImg) {
                        await this.styImageService.delete(imgId); // ลบไฟล์เก่า
                    }
                }
            }

            if (flagReset) {
                await this.doactionService.doAction(
                    { ...form, ACTION: 'returnp', EMPNO: dto.EMPNO },
                    ip,
                );
                await this.flowService.updateFlow({
                    condition: {
                        ...form,
                        CSTEPNO: '52',
                    },
                    VAPVNO: 'SYSTEM',
                });
            }
            if (dto.ACTION !== 'save') {
                // หากมีการเปลี่ยนแปลงผู้รับผิดชอบ ต้องทำการ reset flow และ set step 52 เป็น SYSTEM เพื่อไม่ให้ user สับสนเพราะต้องถูก set ใหม่
                await this.doactionService.doAction(
                    {
                        ...form,
                        EMPNO: dto.EMPNO,
                        ACTION: dto.ACTION,
                        REMARK: dto.REMARK
                            ? dto.REMARK
                            : 'เปลี่ยนแผนกรับผิดชอบ',
                    },
                    ip,
                );
            }
            return {
                status: true,
                message: 'Saved Successfully',
            };
        } catch (error) {
            throw new Error(`Failed to save draft: ${error.message}`);
        }
    }
}
