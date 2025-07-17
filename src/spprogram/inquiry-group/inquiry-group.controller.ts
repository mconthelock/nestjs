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
import { CreateInquiryGroupDto } from './dto/create-inquiry-group.dto';
import { UpdateInquiryGroupDto } from './dto/update-inquiry-group.dto';

@Controller('inquiry-group')
export class InquiryGroupController {
  constructor(private readonly inquiryGroupService: InquiryGroupService) {}
}
