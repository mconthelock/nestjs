import { Module } from '@nestjs/common';
import { GpFileService } from './gp-file.service';
import { GpFileController } from './gp-file.controller';
import { GpFileRepository } from './gp-file.repository';

@Module({
    controllers: [GpFileController],
    providers: [GpFileService, GpFileRepository],
    exports: [GpFileService],
})
export class GpFileModule {}
