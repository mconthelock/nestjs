import { Module } from '@nestjs/common';
import { GpGarService } from './gp-gar.service';
import { GpGarController } from './gp-gar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GPGAR_CATEGORY } from 'src/common/Entities/webform/table/GPGAR_CATEGORY.entity';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { FormModule } from 'src/webform/form/form.module';
import { GpGarRepository } from './gp-gar-repository';
import { GP_FILE } from 'src/common/Entities/webform/table/GP_FILE.entity';
import { HandleFileFormModule } from 'src/webform/handle-file-form/handle-file-form.module';


@Module({
  imports: [TypeOrmModule.forFeature([GPGAR_CATEGORY], 'webformConnection'),
  FormmstModule,
  FormModule,
  HandleFileFormModule
],
  controllers: [GpGarController],
  providers: [GpGarService, GpGarRepository],
  exports:[GpGarService],
})
export class GpGarModule {}
