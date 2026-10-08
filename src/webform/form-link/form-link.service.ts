import { Injectable } from '@nestjs/common';
import { FormLinkRepository } from './form-link.repository';
import type { FORM_LINK } from 'src/common/Entities/webform/table/FROM_LINK.entitiy';
@Injectable()
export class FormLinkService {
    constructor(private readonly repo: FormLinkRepository) {}

    async create(data: FORM_LINK){
        try {
            const res = await this.repo.create(data);
            if(!res) {
                return {
                    status: false,
                    message: 'Failed to create form link'
                }
            }
            return {
                status: true,
                message: 'Form link created successfully',
                data: res
            }

        } catch (error) {
            throw error;
        }
    }

    async delete(formNo: string){
        try {
            const res = await this.repo.delete(formNo);
            if(!res) {
                return {
                    status: false,
                    message: 'Failed to delete form link'
                }
            }
            return {
                status: true,
                message: 'Form link deleted successfully',
                data: res
            }
        } catch (error) {
            throw error;
        }
    }
}
