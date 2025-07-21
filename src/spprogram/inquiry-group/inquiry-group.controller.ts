import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InquiryGroupService } from './inquiry-group.service';

@Controller('inquiry-group')
export class InquiryGroupController {
  constructor(private readonly inquiryGroupService: InquiryGroupService) {}
}
