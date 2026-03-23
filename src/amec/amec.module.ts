import { Module } from '@nestjs/common';
import { AemployeeModule } from './aemployee/aemployee.module';
import { PdivisionModule } from './pdivision/pdivision.module';
import { PdepartmentModule } from './pdepartment/pdepartment.module';
import { PsectionModule } from './psection/psection.module';
import { UsersModule } from './users/users.module';
import { PpositionModule } from './pposition/pposition.module';
import { PprbiddingModule } from './pprbidding/pprbidding.module';
import { PpoModule } from './ppo/ppo.module';
import { PprModule } from './ppr/ppr.module';
import { PproductModule } from './pproduct/pproduct.module';
import { PvenderModule } from './pvender/pvender.module';
import { BrcurrencyModule } from './brcurrency/brcurrency.module';

@Module({
  imports: [
    PdivisionModule,
    AemployeeModule,
    PdepartmentModule,
    PsectionModule,
    UsersModule,
    PpositionModule,
    PprbiddingModule,
    PpoModule,
    PprModule,
    PproductModule,
    PvenderModule,
    BrcurrencyModule,
  ],
})
export class AmecModule {}
