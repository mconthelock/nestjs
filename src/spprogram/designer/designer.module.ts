import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignerService } from './designer.service';
import { Designer } from './entities/designer.entity';
import { DesignerController } from './designer.controller';

@Module({
  controllers: [DesignerController],
  imports: [
    TypeOrmModule.forFeature([Designer], 'amecConnection')
  ],
  providers: [DesignerService],
})
export class DesignerModule {}
