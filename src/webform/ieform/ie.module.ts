import { Module } from '@nestjs/common';
import { IeBgrModule } from './ie-bgr/ie-bgr.module';

@Module({
  imports: [IeBgrModule],
})
export class IEFormModule {}
