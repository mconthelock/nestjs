import { Module } from '@nestjs/common';
import { AemployeeModule } from './aemployee/aemployee.module';
import { PdivisionModule } from './pdivision/pdivision.module';
import { PdepartmentModule } from './pdepartment/pdepartment.module';
import { PsectionModule } from './psection/psection.module';

@Module({
  imports: [
    PdivisionModule,
    AemployeeModule,
    PdepartmentModule,
    PsectionModule,
  ],
})
export class AmecModule {}
