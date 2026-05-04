import { Module } from '@nestjs/common';
import { StyImageService } from './sty-image.service';
import { StyImageController } from './sty-image.controller';
import { StyImageRepository } from './sty-image.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { STY_IMAGE } from 'src/common/Entities/gpreport/table/STY_IMAGE.entity';

@Module({
    imports: [TypeOrmModule.forFeature([STY_IMAGE], 'gpreportConnection')],
    controllers: [StyImageController],
    providers: [StyImageService, StyImageRepository],
    exports: [StyImageService],
})
export class StyImageModule {}
