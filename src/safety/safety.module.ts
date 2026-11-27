import { Module } from '@nestjs/common';
import { SafetyChemicalModule } from './chemical/safety-chemical.module';

@Module({
  imports: [
    SafetyChemicalModule
  ],
})
export class SafetyModule {}
