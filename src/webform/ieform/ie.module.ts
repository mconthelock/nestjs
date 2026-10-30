import { Module } from '@nestjs/common';
import { IeBgrModule } from './ie-bgr/ie-bgr.module';
import { IeFileModule } from './ie-file/ie-file.module';
import { IeTsModule } from './IE-PTS/ie-ts.module';

@Module({
  imports: [IeBgrModule, IeFileModule, IeTsModule],
})
export class IEFormModule {}
