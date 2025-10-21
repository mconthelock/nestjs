import { Module } from '@nestjs/common';
import { FowarderModule } from './fowarder/fowarder.module';
import { ModeModule } from './mode/mode.module';

@Module({
  imports: [FowarderModule, ModeModule],
})
export class InvoiceModule {}
