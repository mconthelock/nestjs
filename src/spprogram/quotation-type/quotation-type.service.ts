import { Injectable } from '@nestjs/common';
import { CreateQuotationTypeDto } from './dto/create-quotation-type.dto';
import { UpdateQuotationTypeDto } from './dto/update-quotation-type.dto';

@Injectable()
export class QuotationTypeService {
  create(createQuotationTypeDto: CreateQuotationTypeDto) {
    return 'This action adds a new quotationType';
  }

  findAll() {
    return `This action returns all quotationType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quotationType`;
  }

  update(id: number, updateQuotationTypeDto: UpdateQuotationTypeDto) {
    return `This action updates a #${id} quotationType`;
  }

  remove(id: number) {
    return `This action removes a #${id} quotationType`;
  }
}
