import { Module } from '@nestjs/common';
import { StinpFormListService } from './stinp-form-list.service';
import { StinpFormListController } from './stinp-form-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { STINP_FORM_LIST } from 'src/common/Entities/gpreport/table/STINP_FORM_LIST.entity';
import { StinpFormListRepository } from './stinp-form-list.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([STINP_FORM_LIST], 'gpreportConnection'),
    ],
    controllers: [StinpFormListController],
    providers: [StinpFormListService, StinpFormListRepository],
    exports: [StinpFormListService],
})
export class StinpFormListModule {}
