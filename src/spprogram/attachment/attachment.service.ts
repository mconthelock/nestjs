import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
// import { Attachment } from './entities/attachment.entity';

@Injectable()
export class AttachmentService {
  //   constructor(
  //     @InjectRepository(Attachment, 'amecConnection')
  //     private readonly attch: Repository<Attachment>,
  //   ) {}
}
