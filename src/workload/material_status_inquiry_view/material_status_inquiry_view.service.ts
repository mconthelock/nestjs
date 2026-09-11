import { Injectable } from '@nestjs/common';
import { MaterialStatusInquiryViewRepository } from './material_status_inquiry_view.repository';
import { IfindByDataTableServerside } from './material_status_inquiry_view.interface';

@Injectable()
export class MaterialStatusInquiryViewService {
    constructor(private readonly repo: MaterialStatusInquiryViewRepository) {}

    async findByDataTableServerside(data: IfindByDataTableServerside) {
        try {
            return this.repo.findByDataTableServerside(data);
        } catch (error) {
            throw error;
        }
    }
}
