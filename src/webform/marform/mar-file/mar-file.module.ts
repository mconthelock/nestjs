import { Module } from '@nestjs/common';
import { MarFileService } from './mar-file.service';
import { MarFileController } from './mar-file.controller';
import { MarFileRepository } from './mar-file.repository';

@Module({
    controllers: [MarFileController],
    providers: [MarFileService, MarFileRepository],
    exports: [MarFileService],
})
export class MarFileModule {}
