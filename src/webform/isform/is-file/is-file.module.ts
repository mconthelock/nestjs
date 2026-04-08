import { Module } from '@nestjs/common';
import { IsFileService } from './is-file.service';
import { IsFileController } from './is-file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsFileRepository } from './is-file.repository';
import { IS_FILE } from 'src/common/Entities/webform/table/IS_FILE.entity';

@Module({
    imports: [TypeOrmModule.forFeature([IS_FILE], 'webformConnection')],
    controllers: [IsFileController],
    providers: [IsFileService, IsFileRepository],
    exports: [IsFileService],
})
export class IsFileModule {}
