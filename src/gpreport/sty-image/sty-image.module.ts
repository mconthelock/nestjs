import { Module } from '@nestjs/common';
import { StyImageService } from './sty-image.service';
import { StyImageRepository } from './sty-image.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { STY_IMAGE } from 'src/common/Entities/gpreport/table/STY_IMAGE.entity';

@Module({
    imports: [TypeOrmModule.forFeature([STY_IMAGE], 'gpreportConnection')],
    providers: [StyImageService, StyImageRepository],
    exports: [StyImageService],
})
export class StyImageModule {}
