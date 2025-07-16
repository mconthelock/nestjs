import { PartialType } from '@nestjs/swagger';
import { CreateInquiryDetailDto } from './create-inquiry-detail.dto';

export class UpdateInquiryDetailDto extends PartialType(CreateInquiryDetailDto) {}
