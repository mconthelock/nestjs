import { Module } from '@nestjs/common';
import { IeBgrModule } from './ie-bgr/ie-bgr.module';
import { IeFileModule } from './ie-file/ie-file.module';

@Module({
  imports: [IeBgrModule, IeFileModule],
})
export class IEFormModule {}
