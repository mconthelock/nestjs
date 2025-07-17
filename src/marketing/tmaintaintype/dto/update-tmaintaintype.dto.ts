import { PartialType } from '@nestjs/swagger';
import { CreateTmaintaintypeDto } from './create-tmaintaintype.dto';

export class UpdateTmaintaintypeDto extends PartialType(CreateTmaintaintypeDto) {}
