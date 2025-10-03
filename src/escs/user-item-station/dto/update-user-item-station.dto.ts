import { PartialType } from '@nestjs/swagger';
import { ESCSCreateUserItemStationDto } from './create-user-item-station.dto';

export class ESCSUpdateUserItemStationDto extends PartialType(ESCSCreateUserItemStationDto) {}
