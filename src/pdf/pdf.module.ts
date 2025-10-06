
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PDFController } from './pdf.controller';
import { PDFService } from './pdf.service';

@Module({
  controllers: [PDFController],
  providers: [PDFService],
  exports: [PDFService], 
})
export class PDFModule {}
