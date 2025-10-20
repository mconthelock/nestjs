import { Module } from '@nestjs/common';
import { FowarderModule } from './fowarder/fowarder.module';

@Module({
  imports: [FowarderModule]
})
export class InvoiceModule {}
