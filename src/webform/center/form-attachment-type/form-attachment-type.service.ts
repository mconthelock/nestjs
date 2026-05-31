import { Injectable } from '@nestjs/common';
import { CreateFormAttachmentTypeDto } from './dto/create-form-attachment-type.dto';
import { UpdateFormAttachmentTypeDto } from './dto/update-form-attachment-type.dto';
import { FormAttachmentRepository } from './form-attachment-type.repository';

@Injectable()
export class FormAttachmentTypeService {
    constructor(private readonly repo: FormAttachmentRepository) {}
    async findOneById(id: number) {
        try {
            const res = await this.repo.findOne({ NID: id });
            if (!res) {
                return {
                    status: false,
                    message: 'Data not found',
                };
            }
            return {
                status: true,
                data: res,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async findOneByCode(code: string) {
        try {
            const res = await this.repo.findOne({ VCODE: code });
            if (!res) {
                return {
                    status: false,
                    message: 'Data not found',
                };
            }
            return {
                status: true,
                data: res,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async create(dto: CreateFormAttachmentTypeDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                return {
                    status: false,
                    message: 'Insert form attachment type failed',
                };
            }
            return {
                status: true,
                data: res,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
