import { Module } from '@nestjs/common';
import { FeFileService } from './fe-file.service';
import { FeFileController } from './fe-file.controller';
import { FeFileRepository } from './fe-file.repository';

@Module({
    controllers: [FeFileController],
    providers: [FeFileService, FeFileRepository],
    exports: [FeFileService],
})
export class FeFileModule {}
