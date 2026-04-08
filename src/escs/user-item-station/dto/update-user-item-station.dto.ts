import { PartialType } from '@nestjs/swagger';
import { CreateUsersItemStationDto } from './create-user-item-station.dto';

export class UpdateUsersItemStationDto extends PartialType(CreateUsersItemStationDto) {}
