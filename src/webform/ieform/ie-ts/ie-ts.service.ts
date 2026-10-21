import { Injectable } from '@nestjs/common';
import { RequestIetsDto } from './dto/request-ie-ts.dto';
import { UpdateIetsDto } from './dto/update-ie-ts.dto';
import { IetsFormRepository } from './iets_form/iets_form.repository';
import { IetsListService } from './iets_list/iets_list.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { Request } from 'express';
@Injectable()
export class IeTsService {
    constructor(
        protected readonly repotsf: IetsFormRepository,
        protected readonly servicetsl: IetsListService,
        private readonly formCreateService: FormCreateService,
    ) {}
    async request(dto: RequestIetsDto, ip: string) {
        try {
            const { REQBY, INPUTBY, DRAFT, REMARK, DWGLIST, ...data } = dto;
            const createForm = await this.formCreateService.create(
                {
                    NFRMNO: dto.NFRMNO,
                    VORGNO: dto.VORGNO,
                    CYEAR: dto.CYEAR,
                    REQBY: REQBY,
                    INPUTBY: INPUTBY,
                    REMARK: REMARK,
                    ...(DRAFT !== undefined && { DRAFT: DRAFT }),
                },
                ip,
            );
            if (!createForm.status) {
                throw new Error(createForm.message.message);
            }
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
            };
            const dataform = {
                ...form,
                JUN: dto.JUN,
                TSORGNO: dto.TSORGNO,
            };
            await this.repotsf.insert(dataform);
            if (DWGLIST && DWGLIST.length > 0) {
                await this.servicetsl.createMultipleLists(form, DWGLIST);
            }
            return {
                status: true,
                message: 'Request successful',
            };
        } catch (error) {
            throw new Error('Request IE-TS Form Error: ' + error.message);
        }
    }

    findAll() {
        return `This action returns all ieTs`;
    }

    findOne(id: number) {
        return `This action returns a #${id} ieT`;
    }

    update(id: number, updateIeTDto: UpdateIetsDto) {
        return `This action updates a #${id} ieT`;
    }

    remove(id: number) {
        return `This action removes a #${id} ieT`;
    }
}
