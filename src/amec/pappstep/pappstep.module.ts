import { Module } from '@nestjs/common';
import { PappstepService } from './pappstep.service';
import { PappstepController } from './pappstep.controller';
import { PappflowModule } from '../pappflow/pappflow.module';

@Module({
  controllers: [PappstepController],
  providers: [PappstepService],
})
export class PappstepModule {}
