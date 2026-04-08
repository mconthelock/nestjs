import { Module } from '@nestjs/common';
import { EbgreqcolImageService } from './ebgreqcol-image.service';
import { EbgreqcolImageController } from './ebgreqcol-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EBGREQCOL_IMAGE } from 'src/common/Entities/ebudget/table/EBGREQCOL_IMAGE.entity';
import { EbgreqcolImageRepository } from './ebgreqcol-image.repository';

@Module({
    imports: [TypeOrmModule.forFeature([EBGREQCOL_IMAGE], 'ebudgetConnection')],
    controllers: [EbgreqcolImageController],
    providers: [EbgreqcolImageService, EbgreqcolImageRepository],
    exports: [EbgreqcolImageService],
})
export class EbgreqcolImageModule {}
