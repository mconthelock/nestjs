import { Controller } from '@nestjs/common';
import { UsersAuthorizeService } from './user-authorize.service';

@Controller('escs/user-authorize')
export class UsersAuthorizeController {
    constructor(private readonly userAuthorizeService: UsersAuthorizeService) {}
}
