import { PartialType } from '@nestjs/swagger';
import { CreateBusrouteDto } from './create-busroute.dto';

export class UpdateBusrouteDto extends PartialType(CreateBusrouteDto) {}
