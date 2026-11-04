import { Module } from '@nestjs/common';
import { IeFileService } from './ie-file.service';
import { IeFileController } from './ie-file.controller';
import { IeFileRepository } from './ie-file.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IE_FILE } from 'src/common/Entities/webform/table/IE_FILE.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        IE_FILE,
    ], 'mitsuConnection'),
    ],
    controllers: [IeFileController],
    providers: [IeFileService, IeFileRepository],
    exports: [IeFileService],
})
export class IeFileModule {}
