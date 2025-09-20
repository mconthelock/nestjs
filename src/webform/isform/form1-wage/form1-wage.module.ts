import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form1WageService } from './form1-wage.service';
import { Form1Wage } from './entities/form1-wage.entity';
import { Form1WageController } from './form1-wage.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Form1Wage], 'webformConnection')],
  controllers: [Form1WageController],
  providers: [Form1WageService],
})
export class Form1WageModule {}
