import { Module } from '@nestjs/common';
import { AemployeeModule } from './aemployee/aemployee.module';
import { PdivisionModule } from './pdivision/pdivision.module';
import { PdepartmentModule } from './pdepartment/pdepartment.module';
import { PsectionModule } from './psection/psection.module';
import { UsersModule } from './users/users.module';
import { PpositionModule } from './pposition/pposition.module';

@Module({
  imports: [
    PdivisionModule,
    AemployeeModule,
    PdepartmentModule,
    PsectionModule,
    UsersModule,
    PpositionModule,
  ],
})
export class AmecModule {}
