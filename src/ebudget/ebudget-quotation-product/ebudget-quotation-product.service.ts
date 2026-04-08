import { Injectable } from '@nestjs/common';
import { CreateEbudgetQuotationProductDto } from './dto/create-ebudget-quotation-product.dto';
import { EbudgetQuotationProductRepository } from './ebudget-quotation-product.repository';

@Injectable()
export class EbudgetQuotationProductService {
    constructor(private readonly repo: EbudgetQuotationProductRepository) {}

    async insert(dto: CreateEbudgetQuotationProductDto) {
        try {
            const res = await this.repo.insert(dto);
            if (!res) {
                throw new Error('Insert EBUDGET_QUOTATION_PRODUCT Failed');
            }
            return {
                status: true,
                message: 'Insert EBUDGET_QUOTATION_PRODUCT Successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(
                'Insert EBUDGET_QUOTATION_PRODUCT Error: ' + error.message,
            );
        }
    }

    async getData(id: number) {
        return this.repo.getData(id);
    }
}
