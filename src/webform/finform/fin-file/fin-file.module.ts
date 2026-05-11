import { Module } from '@nestjs/common';
import { FinFileService } from './fin-file.service';
import { FinFileController } from './fin-file.controller';
import { FinFileRepository } from './fin-file.repository';

@Module({
    controllers: [FinFileController],
    providers: [FinFileService, FinFileRepository],
    exports: [FinFileService],
})
export class FinFileModule {}
