import { Module } from '@nestjs/common';
import { PsFileService } from './ps-file.service';
import { PsFileController } from './ps-file.controller';
import { PsFileRepository } from './ps-file.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PS_FILE } from 'src/common/Entities/webform/table/PS_FILE.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        PS_FILE,
    ], 'mitsuConnection'),
    ],
    controllers: [PsFileController],
    providers: [PsFileService, PsFileRepository],
    exports: [PsFileService],
})
export class PsFileModule {}
