import { Controller } from '@nestjs/common';
import { InquiryLogService } from './inquiry-log.service';

@Controller('inquiry-log')
export class InquiryLogController {
  constructor(private readonly inquiryLogService: InquiryLogService) {}
}
