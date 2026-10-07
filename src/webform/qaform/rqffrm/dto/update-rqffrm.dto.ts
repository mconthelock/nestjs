import { PartialType } from '@nestjs/swagger';
import { CreateRqffrmDto } from './create-rqffrm.dto';

export class UpdateRqffrmDto extends PartialType(CreateRqffrmDto) {}
