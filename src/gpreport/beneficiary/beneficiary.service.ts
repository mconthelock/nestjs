import { Injectable } from '@nestjs/common';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { UpdateBeneficiaryDto } from './dto/update-beneficiary.dto';
import { BeneficiaryRepository } from './beneficiary.repository';

@Injectable()
export class BeneficiaryService {
    constructor(
        private readonly beneficiaryRepository: BeneficiaryRepository,
    ) {}
    getDetail(id: string) {
        
        return this.beneficiaryRepository.getDetail(id);
    }
}
