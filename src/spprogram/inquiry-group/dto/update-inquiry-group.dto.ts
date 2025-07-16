import { PartialType } from '@nestjs/swagger';
import { CreateInquiryGroupDto } from './create-inquiry-group.dto';

export class UpdateInquiryGroupDto extends PartialType(CreateInquiryGroupDto) {}
