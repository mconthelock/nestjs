import { Module } from '@nestjs/common';
import { ReportProdService } from './report_prod.service';
import { ReportProdController } from './report_prod.controller';
import { ReportProdRepository } from './report_prod.repository';

@Module({
  controllers: [ReportProdController],
  providers: [ReportProdService, ReportProdRepository],
})
export class ReportProdModule {}
