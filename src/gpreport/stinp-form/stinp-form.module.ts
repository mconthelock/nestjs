import { Module } from '@nestjs/common';
import { StinpFormService } from './stinp-form.service';
import { StinpFormController } from './stinp-form.controller';
import { StinpFormRepository } from './stinp-form.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { STINP_FORM } from 'src/common/Entities/gpreport/table/STINP_FORM.entity';

@Module({
    imports: [TypeOrmModule.forFeature([STINP_FORM], 'gpreportConnection')],
    controllers: [StinpFormController],
    providers: [StinpFormService, StinpFormRepository],
    exports: [StinpFormService],
})
export class StinpFormModule {}
