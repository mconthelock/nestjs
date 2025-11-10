import { Module } from '@nestjs/common';
import { ChemicalSectionService } from './chemical-section.service';
import { ChemicalSectionController } from './chemical-section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChemicalSection } from './entities/chemical-section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChemicalSection],'gpreportConnection')],
  controllers: [ChemicalSectionController],
  providers: [ChemicalSectionService],
  exports: [ChemicalSectionService],
})
export class ChemicalSectionModule {}
