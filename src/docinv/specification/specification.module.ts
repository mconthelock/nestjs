import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecificationService } from './specification.service';
import { SpecificationController } from './specification.controller';
import { Specification } from './entities/specification.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Specification], 'amecConnection')],
  controllers: [SpecificationController],
  providers: [SpecificationService],
})
export class SpecificationModule {}
