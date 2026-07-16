import { Module } from '@nestjs/common';
import { CheckinventoryService } from './checkinventory.service';
import { CheckinventoryController } from './checkinventory.controller';
import { CheckinventoryRepository } from './checkinventory.repository';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';

@Module({
  imports: [FormmstModule, FormModule],
  controllers: [CheckinventoryController],
  providers: [CheckinventoryService, CheckinventoryRepository],
})
export class CheckinventoryModule {}
