import { Module } from '@nestjs/common';
import { FinFileService } from './fin-file.service';
import { FinFileController } from './fin-file.controller';
import { FinFileRepository } from './fin-file.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FIN_FILE } from 'src/common/Entities/webform/table/FIN_FILE.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        FIN_FILE,
    ], 'mitsuConnection'),
    ],
    controllers: [FinFileController],
    providers: [FinFileService, FinFileRepository],
    exports: [FinFileService],
})
export class FinFileModule {}
