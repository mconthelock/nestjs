import { Module } from '@nestjs/common';
import { PsFileService } from './ps-file.service';
import { PsFileController } from './ps-file.controller';
import { PsFileRepository } from './ps-file.repository';

@Module({
    controllers: [PsFileController],
    providers: [PsFileService, PsFileRepository],
    exports: [PsFileService],
})
export class PsFileModule {}
