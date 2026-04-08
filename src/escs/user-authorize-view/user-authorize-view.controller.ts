import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { UsersAuthorizeViewService } from './user-authorize-view.service';
import { SearchUserAuthorizeViewDto } from './dto/search-user-authorize-view.dto';

@Controller('escs/user-authorize-view')
export class UsersAuthorizeViewController {
  constructor(
    private readonly usersAuthorizeViewService: UsersAuthorizeViewService,
  ) {}

  @Post('getUserAuthorizeView')
  async getUserAuthorizeView(@Body() dto: SearchUserAuthorizeViewDto) {
    return this.usersAuthorizeViewService.getUserAuthorizeView(dto);
  }
}
