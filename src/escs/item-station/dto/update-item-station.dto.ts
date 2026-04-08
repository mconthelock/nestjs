import { PartialType } from '@nestjs/swagger';
import { CreateItemStationDto } from './create-item-station.dto';

export class UpdateItemStationDto extends PartialType(CreateItemStationDto) {}
