import { PartialType } from '@nestjs/swagger';
import { CreateFinpckVwstatusDto } from './create-finpck-vwstatus.dto';

export class UpdateFinpckVwstatusDto extends PartialType(CreateFinpckVwstatusDto) {}
