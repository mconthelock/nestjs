import { Module } from '@nestjs/common';
import { IsDevModule } from './is-dev/is-dev.module';

@Module({
  imports: [IsDevModule],
})
export class ISFormModule {}
