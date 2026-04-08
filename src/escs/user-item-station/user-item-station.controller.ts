import { Controller } from '@nestjs/common';
import { UsersItemStationService } from './user-item-station.service';
import { CreateUsersItemStationDto } from './dto/create-user-item-station.dto';
import { UpdateUsersItemStationDto } from './dto/update-user-item-station.dto';

@Controller('escs/user-item-station')
export class UsersItemStationController {
    constructor(
        private readonly usersItemStationService: UsersItemStationService,
    ) {}
}
