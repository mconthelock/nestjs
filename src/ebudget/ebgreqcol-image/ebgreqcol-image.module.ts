import { Module } from '@nestjs/common';
import { EbgreqcolImageService } from './ebgreqcol-image.service';
import { EbgreqcolImageController } from './ebgreqcol-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EBGREQCOL_IMAGE } from 'src/common/Entities/ebudget/table/EBGREQCOL_IMAGE.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EBGREQCOL_IMAGE], 'ebudgetConnection')],
  controllers: [EbgreqcolImageController],
  providers: [EbgreqcolImageService],
  exports: [EbgreqcolImageService],
})
export class EbgreqcolImageModule {}
