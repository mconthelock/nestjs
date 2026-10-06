import { Module } from '@nestjs/common';
import { GpTphService } from './gp-tph.service';
import { GpTphController } from './gp-tph.controller';
import { GPTPH_LOCATION } from 'src/common/Entities/webform/table/GPTPH_LOCATION.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GPTPH_AREAS } from 'src/common/Entities/webform/table/GPTPH_AREAS.entity';
import { GpTphRepository } from './gp-tph.repository';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { FormModule } from 'src/webform/form/form.module';
import { FlowModule } from 'src/webform/flow/flow.module';
import { GPTPH_REQ_HEADER } from 'src/common/Entities/webform/table/GPTPH_REQ_HEADER.entity';
import { GPTPH_APPLICANT } from 'src/common/Entities/webform/table/GPTPH_APPLICANT.entity';
import { GPTPH_AREA_RECORD } from 'src/common/Entities/webform/table/GPTPH_AREA_RECORD.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [GPTPH_AREAS,GPTPH_LOCATION,GPTPH_REQ_HEADER,GPTPH_APPLICANT,GPTPH_AREA_RECORD],
      'webformConnection',),
              FormmstModule,
              FormModule,
              FlowModule,
  ],
  controllers: [GpTphController],
  providers: [GpTphService, GpTphRepository],
  exports: [GpTphService],
})
export class GpTphModule {}
