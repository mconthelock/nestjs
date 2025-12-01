import { Module } from '@nestjs/common';
import { ChemicalSectionModule } from './chemical-section/chemical-section.module';

@Module({
  imports: [
    ChemicalSectionModule
  ],
})
export class SafetyChemicalModule {}
