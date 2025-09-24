import { PartialType } from '@nestjs/swagger';
import { CreateESCSItemStationDto } from './create-item-station.dto';

export class UpdateESCSItemStationDto extends PartialType(CreateESCSItemStationDto) {}
