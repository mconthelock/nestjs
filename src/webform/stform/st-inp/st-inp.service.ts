import { Injectable } from '@nestjs/common';
import { CreateStInpDto } from './dto/create-st-inp.dto';
import { UpdateStInpDto } from './dto/update-st-inp.dto';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { StyImageService } from 'src/gpreport/sty-image/sty-image.service';
import { deleteFile } from 'src/common/utils/files.utils';
import { StyTypeService } from 'src/gpreport/sty-type/sty-type.service';
import { StyPatrolService } from 'src/gpreport/sty-patrol/sty-patrol.service';
import { CreateStyPatrolDto } from 'src/gpreport/sty-patrol/dto/create-sty-patrol.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { FlowService } from 'src/webform/flow/flow.service';

@Injectable()
export class StInpService {
    constructor(
        protected readonly createFormService: FormCreateService,
        protected readonly formmstService: FormmstService,
        protected readonly styImageService: StyImageService,
        protected readonly styTypeService: StyTypeService,
        protected readonly styPatrolService: StyPatrolService,
        protected readonly flowService: FlowService,
    ) {}

    async createForm(dto: CreateFormDto, ip: string, owner: string) {
        try {
            const createForm = await this.createFormService.create(dto, ip);
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
            for (const step of ['06', '19']) {
                const update = await this.flowService.updateFlow({
                    condition: {
                        ...form,
                        CSTEPNO: step,
                    },
                    VAPVNO: owner,
                });
            }

            return form;
        } catch (error) {
            throw new Error(`Failed to create form: ${error.message}`);
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

            const dataList = {
                ...form,
                PA_OWNER: dto.PA_OWNER,
                PA_DATE: dto.PA_DATE,
                PA_SECTION: dto.PA_SECTION,
                PA_AUDIT: dto.PA_AUDIT,
                PA_USERCREATE: dto.PA_USERCREATE,
            };

            for (const list of dto.PA_LIST) {
                const index = dto.PA_LIST.indexOf(list) + 1;
                // insert and move image
                const movedFile = await this.styImageService.moveAndInsertFiles(
                    {
                        file: files[index - 1],
                        path,
                        userCreate: dto.PA_USERCREATE,
                        typeId: styType.data[0].TYPE_ID,
                    },
                );
                movedTargets.push(...movedFile.path);
                const dataPatrol = {
                    ...dataList,
                    PA_ID: index,
                    PA_ITEMS: list.PA_ITEMS,
                    PA_AREA: list.PA_AREA,
                    PA_DETECTED: list.PA_DETECTED,
                    PA_CLASS: list.PA_CLASS,
                    PA_SUGGESTION: list.PA_SUGGESTION || null,
                    PA_MAT: list.PA_MAT,
                    PA_IMAGE: movedFile.data.IMAGE_ID,
                };
                await this.styPatrolService.create(dataPatrol);
            }
            return movedTargets;
        } catch (error) {
            throw new Error(`Failed to insert list: ${error.message}`);
        }
    }
}
