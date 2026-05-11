import { Module } from '@nestjs/common';
import { MfgFileService } from './mfg-file.service';
import { MfgFileController } from './mfg-file.controller';
import { MfgFileRepository } from './mfg-file.repository';

@Module({
    controllers: [MfgFileController],
    providers: [MfgFileService, MfgFileRepository],
    exports: [MfgFileService],
})
export class MfgFileModule {}
