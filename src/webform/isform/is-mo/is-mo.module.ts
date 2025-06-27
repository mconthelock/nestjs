import { Module } from '@nestjs/common';
import { IsMoService } from './is-mo.service';
import { IsMoController } from './is-mo.controller';

@Module({
  controllers: [IsMoController],
  providers: [IsMoService],
})
export class IsMoModule {}
