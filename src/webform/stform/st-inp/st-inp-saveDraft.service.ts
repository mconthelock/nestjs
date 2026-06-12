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
import { deleteFile, joinPaths } from 'src/common/utils/files.utils';

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
            const pathDelete: string[] = [];
            const listDelImg: number[] = [];
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
            // เก็บไฟล์เก่าทั้งหมด เพื่อเตรียมลบ
            const list = await this.stinpFormListService.find(form);
            if (list.status) {
                for (const l of list.data) {
                    const fullPath = await joinPaths(
                        l.IMAGE.IMAGE_PATH,
                        l.IMAGE.IMAGE_FNAME,
                    );
                    listDelImg.push(l.NIMAGE); // เก็บไฟล์เก่าไว้ลบทีหลัง
                    pathDelete.push(fullPath); // เก็บ path ไว้ลบทีหลัง
                }
            }
            // ถ้าไม่มีรายการเลย และมีรายการเดิมอยู่ ให้ลบรายการเดิมทั้งหมด (กรณีที่ผู้ใช้ลบรายการในฟอร์มจนหมด)
            const lengthOfList = dto.PA_LIST ? dto.PA_LIST.length : 0;
            if (!dto.PA_LIST || lengthOfList === 0) {
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
                for (const newlist of dto.PA_LIST) {
                    const index = dto.PA_LIST.indexOf(newlist);
                    const newId = index + 1;
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
                    await this.stinpFormListService.create({
                        ...form,
                        NID: newId,
                        NITEM: newlist.PA_ITEMS,
                        VAREA: newlist.PA_AREA,
                        VDETECTED: newlist.PA_DETECTED,
                        NCLASS: newlist.PA_CLASS,
                        VSUGGESTION: newlist.PA_SUGGESTION || null,
                        NMAT: newlist.PA_MAT,
                        NIMAGE: movedFile.data.IMAGE_ID,
                    });
                }
                if (list.status) {
                    const lists = await this.stinpFormListService.find(form);
                    // ถ้าเจอรายการที่มี NID เกินกว่า length ของ list ที่ส่งมา แสดงว่ารายการนั้นถูกลบไปแล้ว ให้ทำการลบรายการนั้นทิ้ง
                    if (lists.data.some((l) => l.NID > lengthOfList)) {
                        await this.stinpFormListService.deleteMoreThanId(
                            form,
                            lengthOfList,
                        ); // ลบรายการที่เกินจากที่ส่งมา (กรณีที่มีการลบรายการบางส่วนในฟอร์ม แต่ไม่ลบจนหมด)
                    }
                    for (const imgId of listDelImg) {
                        await this.styImageService.delete(imgId); // ลบไฟล์เก่า
                    }
                }
            }
            // throw new Error('Debugging: Check oldLists value');

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
                            : flagReset
                              ? 'เปลี่ยนแผนกรับผิดชอบ'
                              : '',
                    },
                    ip,
                );
            }
            // ลบไฟล์หลังจากทำทุกอย่างเสร็จ กันไม่ให้เกิดปัญหาไฟล์หายระหว่างการบันทึกข้อมูล เพราะถ้าเกิด error ระหว่างการบันทึกข้อมูลแล้วไฟล์ถูกลบไปแล้วจะทำให้ข้อมูลกับไฟล์ไม่ตรงกัน และอาจทำให้เกิดปัญหาในการแก้ไขภายหลังได้
            if (pathDelete.length > 0) {
                for (const p of pathDelete) {
                    await deleteFile(p); // ลบไฟล์เก่า
                }
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
