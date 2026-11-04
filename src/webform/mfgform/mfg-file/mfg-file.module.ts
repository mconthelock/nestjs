import { Module } from '@nestjs/common';
import { MfgFileService } from './mfg-file.service';
import { MfgFileController } from './mfg-file.controller';
import { MfgFileRepository } from './mfg-file.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MFG_FILE } from 'src/common/Entities/webform/table/MFG_FILE.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        MFG_FILE,
    ], 'mitsuConnection'),
    ],
    controllers: [MfgFileController],
    providers: [MfgFileService, MfgFileRepository],
    exports: [MfgFileService],
})
export class MfgFileModule {}
