import { Module } from '@nestjs/common';
import { GpGarService } from './gp-gar.service';
import { GpGarController } from './gp-gar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GPGAR_CATEGORY } from 'src/common/Entities/webform/table/GPGAR_CATEGORY.entity';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { FormModule } from 'src/webform/form/form.module';
import { GpGarRepository } from './gp-gar-repository';
import { HandleFileFormModule } from 'src/webform/handle-file-form/handle-file-form.module';
import { FlowModule } from 'src/webform/flow/flow.module';


@Module({
  imports: [TypeOrmModule.forFeature([GPGAR_CATEGORY], 'webformConnection'),
  FormmstModule,
  FormModule,
  HandleFileFormModule,
  FlowModule
],
  controllers: [GpGarController],
  providers: [GpGarService, GpGarRepository],
  exports:[GpGarService],
})
export class GpGarModule {}
