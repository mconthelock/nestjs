import { PartialType } from '@nestjs/swagger';
import { CreateJopPurConfDto } from './create-jop-pur-conf.dto';

export class UpdateJopPurConfDto extends PartialType(CreateJopPurConfDto) {}
