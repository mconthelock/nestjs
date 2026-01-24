import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartcategoryService } from './partcategory.service';
import { Partcategory } from './entities/partcategory.entity';
import { PartcategoryController } from './partcategory.controller';

@Module({
  controllers: [PartcategoryController],
  imports: [
    TypeOrmModule.forFeature([Partcategory], 'amecConnection')
  ],
  providers: [PartcategoryService],
})
export class PartcategoryModule {}
