import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignerService } from './designer.service';
import { Designer } from './entities/designer.entity';
import { DesignerController } from './designer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Designer], 'spsysConnection')],
  controllers: [DesignerController],
  providers: [DesignerService],
})
export class DesignerModule {}
