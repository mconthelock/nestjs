import { Module } from '@nestjs/common';
import { EKittingService } from './e_kitting.service';
import { EKittingController } from './e_kitting.controller';
import { EKittingRepository } from './e_kitting.repository';

@Module({
  controllers: [EKittingController],
  providers: [EKittingService, EKittingRepository],
})
export class EKittingModule {}
