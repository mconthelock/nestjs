import { Attachments } from './entities/attachments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachments, 'amecConnection')
    private readonly attachmentsRepository: Repository<Attachments>,
  ) {}
}
