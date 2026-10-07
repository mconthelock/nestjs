import { Module } from '@nestjs/common';
import { IsCboService } from './is-cbo.service';
import { IsCboController } from './is-cbo.controller';
import { IsCboRepository } from './is-cbo.reportsitory';

@Module({
  controllers: [IsCboController],
  providers: [IsCboService, IsCboRepository],
})
export class IsCboModule {}
