import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RNSOLVE } from 'src/common/Entities/webform/table/RNSOLVE.entity';

import { RnsolveController } from './rnsolve.controller';
import { RnsolveRepository } from './rnsolve.repository';
import { RnsolveService } from './rnsolve.service';

@Module({
  imports: [TypeOrmModule.forFeature([RNSOLVE], 'webformConnection')],
  controllers: [RnsolveController],
  providers: [RnsolveService, RnsolveRepository],
  exports: [RnsolveService],
})
export class RnsolveModule {}