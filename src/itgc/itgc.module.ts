import { Module } from '@nestjs/common';
import { SpecialuserModule } from './specialuser/specialuser.module';

@Module({
  imports: [SpecialuserModule],
})
export class ItgcModule {}
