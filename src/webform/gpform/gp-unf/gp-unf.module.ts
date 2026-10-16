import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GpUnfRepository } from './gp-unf.repository';

import { GpUnfService } from './gp-unf.service';
import { GpUnfController } from './gp-unf.controller';

import { GPUNF_FORM } from 'src/common/Entities/webform/table/GPUNF_FORM.entity';
import { GPUNF_DETAIL } from 'src/common/Entities/webform/table/GPUNF_DETAIL.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [GPUNF_FORM, GPUNF_DETAIL],
            'webformConnection',
        ),
    ],
    controllers: [GpUnfController],
    providers: [GpUnfService, GpUnfRepository],
})
export class GpUnfModule {}
