import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { AttachmentsService } from './attachments.service';
import { Attachments } from './entities/attachments.entity';
import { AttachmentsController } from './attachments.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachments], 'amecConnection'),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
})
export class AttachmentsModule {}
