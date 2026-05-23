import { Injectable } from '@nestjs/common';
import { CreateStInpDto } from './dto/create-st-inp.dto';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { StyImageService } from 'src/gpreport/sty-image/sty-image.service';
import { StyTypeService } from 'src/gpreport/sty-type/sty-type.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { FlowService } from 'src/webform/flow/flow.service';
import { FormService } from 'src/webform/form/form.service';
import { StinpFormService } from 'src/gpreport/stinp-form/stinp-form.service';
import { StinpFormListService } from 'src/gpreport/stinp-form-list/stinp-form-list.service';

@Injectable()
export class StInpService {
    constructor(
        protected readonly createFormService: FormCreateService,
        protected readonly formmstService: FormmstService,
        protected readonly styImageService: StyImageService,
        protected readonly styTypeService: StyTypeService,
        protected readonly flowService: FlowService,
        protected readonly formService: FormService,
        protected readonly stinpFormService: StinpFormService,
        protected readonly stinpFormListService: StinpFormListService,
    ) {}

    async createForm(dto: CreateFormDto, ip: string, owner: string) {
        try {
            const createForm = await this.createFormService.create(dto, ip, {
                CEXTDATA: 'R',
                CAPPLYALL: '0',
            });
            if (!createForm.status) {
                throw new Error(createForm.message.message);
            }
            const form = {
                NFRMNO: createForm.data.NFRMNO,
                VORGNO: createForm.data.VORGNO,
                CYEAR: createForm.data.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
            };
            await this.setOwnerFlow(form, owner);
            return form;
        } catch (error) {
            throw new Error(`Failed to create form: ${error.message}`);
        }
    }

    async setOwnerFlow(form: FormDto, owner: string) {
        try {
            for (const step of ['06', '19']) {
                const update = await this.flowService.updateFlow({
                    condition: {
                        ...form,
                        CSTEPNO: step,
                    },
                    VAPVNO: owner,
                });
            }
        } catch (error) {
            throw new Error(`Failed to set owner flow: ${error.message}`);
        }
    }

    async insertList({
        form,
        dto,
        files,
        path,
    }: {
        form: FormDto;
        dto: CreateStInpDto;
        files: Express.Multer.File[];
        path: string;
    }) {
        try {
            const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
            const styType = await this.styTypeService.findByTypeCode('PT');
            if (!styType.status) {
                throw new Error('STY Type not found for code PT');
            }

            const insertedStinpForm = await this.stinpFormService.create({
                ...form,
                VOWNER: dto.PA_OWNER,
                DDATE: dto.PA_DATE,
                VSECTION: dto.PA_SECTION,
                VAUDIT: dto.PA_AUDIT,
            });

            const formno = await this.formService.getFormno(form);
            if (dto.PA_LIST?.length > 0) {
                for (const list of dto.PA_LIST) {
                    const index = dto.PA_LIST.indexOf(list) + 1;
                    // insert and move image
                    const movedFile =
                        await this.styImageService.moveAndInsertFiles({
                            file: files[index - 1],
                            path,
                            userCreate: dto.PA_USERCREATE,
                            typeId: styType.data[0].TYPE_ID,
                            folder: formno,
                        });
                    movedTargets.push(...movedFile.path);
                    await this.stinpFormListService.create({
                        ...form,
                        NID: index,
                        NITEM: list.PA_ITEMS,
                        VAREA: list.PA_AREA,
                        VDETECTED: list.PA_DETECTED,
                        NCLASS: list.PA_CLASS,
                        VSUGGESTION: list.PA_SUGGESTION || null,
                        NMAT: list.PA_MAT,
                        NIMAGE: movedFile.data.IMAGE_ID,
                    });
                }
            }

            return movedTargets;
        } catch (error) {
            throw new Error(`Failed to insert list: ${error.message}`);
        }
    }
}
