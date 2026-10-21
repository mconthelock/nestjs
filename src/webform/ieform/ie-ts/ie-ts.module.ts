import { Module } from '@nestjs/common';
import { IeTsService } from './ie-ts.service';
import { IeTsController } from './ie-ts.controller';
import { IetsFormModule } from './iets_form/iets_form.module';
import { IetsListModule } from './iets_list/iets_list.module';

@Module({
  controllers: [IeTsController],
  providers: [IeTsService],
  imports: [IetsFormModule, IetsListModule],
})
export class IeTsModule {}
