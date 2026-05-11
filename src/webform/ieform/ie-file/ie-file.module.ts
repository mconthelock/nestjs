import { Module } from '@nestjs/common';
import { IeFileService } from './ie-file.service';
import { IeFileController } from './ie-file.controller';
import { IeFileRepository } from './ie-file.repository';

@Module({
    controllers: [IeFileController],
    providers: [IeFileService, IeFileRepository],
    exports: [IeFileService],
})
export class IeFileModule {}
