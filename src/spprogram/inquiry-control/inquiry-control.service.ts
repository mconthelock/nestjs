import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateInquiryControlDto } from './dto/create-inquiry-control.dto';
import { UpdateInquiryControlDto } from './dto/update-inquiry-control.dto';
import { InquiryControl } from './entities/inquiry-control.entity';

@Injectable()
export class InquiryControlService {
  constructor(
    @InjectRepository(InquiryControl, 'amecConnection')
    private readonly ctrl: Repository<InquiryControl>,
  ) {}

  findAll() {
    return this.ctrl.find();
  }
}
