import { Body, Controller, Post } from '@nestjs/common';
import { PDFService } from './pdf.service';
import { createPDFDto } from './dto/create.dto';

@Controller('pdf')
export class PDFController {
  constructor(private readonly pdfService: PDFService) {}

  @Post('generate')
  async generatePDF(@Body() dto: createPDFDto) {
    return this.pdfService.generatePDF(dto);
  }
}
