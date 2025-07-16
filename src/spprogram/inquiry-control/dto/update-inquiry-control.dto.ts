import { PartialType } from '@nestjs/swagger';
import { CreateInquiryControlDto } from './create-inquiry-control.dto';

export class UpdateInquiryControlDto extends PartialType(CreateInquiryControlDto) {}
