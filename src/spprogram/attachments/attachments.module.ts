import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentsService } from './attachments.service';
import { Attachments } from './entities/attachments.entity';
import { AttachmentsController } from './attachments.controller';

@Module({
  controllers: [AttachmentsController],
  imports: [
    TypeOrmModule.forFeature([Attachments], 'amecConnection')
  ],
  providers: [AttachmentsService],
})
export class AttachmentsModule {}
