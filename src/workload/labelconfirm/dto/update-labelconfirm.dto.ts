import { PartialType } from '@nestjs/swagger';
import { CreateLabelconfirmDto } from './create-labelconfirm.dto';

export class UpdateLabelconfirmDto extends PartialType(CreateLabelconfirmDto) {}
