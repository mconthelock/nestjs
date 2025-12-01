import { Module } from '@nestjs/common';
import { ChemicalSectionModule } from './chemical/chemical-section/chemical-section.module';
import { SafetyChemicalModule } from './chemical/safety-chemical.module';

@Module({
  imports: [
    SafetyChemicalModule
  ],
})
export class SafetyModule {}
