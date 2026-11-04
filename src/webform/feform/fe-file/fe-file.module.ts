import { Module } from '@nestjs/common';
import { FeFileService } from './fe-file.service';
import { FeFileController } from './fe-file.controller';
import { FeFileRepository } from './fe-file.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FE_FILE } from 'src/common/Entities/webform/table/FE_FILE.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        FE_FILE,
    ], 'mitsuConnection'),
    ],
    controllers: [FeFileController],
    providers: [FeFileService, FeFileRepository],
    exports: [FeFileService],
})
export class FeFileModule {}
