import { Module } from '@nestjs/common';
import { GpFileService } from './gp-file.service';
import { GpFileController } from './gp-file.controller';
import { GpFileRepository } from './gp-file.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GP_FILE } from 'src/common/Entities/webform/table/GP_FILE.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        GP_FILE,
    ], 'mitsuConnection'),
    ],
    controllers: [GpFileController],
    providers: [GpFileService, GpFileRepository],
    exports: [GpFileService],
})
export class GpFileModule {}
