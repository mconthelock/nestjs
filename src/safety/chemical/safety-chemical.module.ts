import { Module } from '@nestjs/common';
import { ChemicalSectionModule } from './chemical-section/chemical-section.module';
import { SafetyFollowModule } from './follow/follow.module';

@Module({
    imports: [ChemicalSectionModule, SafetyFollowModule],
})
export class SafetyChemicalModule {}
