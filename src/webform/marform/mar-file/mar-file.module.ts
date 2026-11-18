import { Module } from '@nestjs/common';
import { MarFileService } from './mar-file.service';
import { MarFileController } from './mar-file.controller';
import { MarFileRepository } from './mar-file.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MAR_FILE } from 'src/common/Entities/webform/table/MAR_FILE.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        MAR_FILE,
    ], 'mitsuConnection'),
    ],
    controllers: [MarFileController],
    providers: [MarFileService, MarFileRepository],
    exports: [MarFileService],
})
export class MarFileModule {}
