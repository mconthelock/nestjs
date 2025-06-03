import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AemployeeService } from './aemployee.service';
import { AemployeeController } from './aemployee.controller';
import { AEmployee } from './entities/aemployee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AEmployee], 'amecConnection')],
  controllers: [AemployeeController],
  providers: [AemployeeService],
})
export class AemployeeModule {}
