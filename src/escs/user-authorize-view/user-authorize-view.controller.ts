import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ESCSUserAuthorizeViewService } from './user-authorize-view.service';
import { ESCSSearchUserAuthorizeViewDto } from './dto/search-user-authorize-view.dto';

@Controller('escs/user-authorize-view')
export class ESCSUserAuthorizeViewController {
  constructor(
    private readonly userAuthorizeViewService: ESCSUserAuthorizeViewService,
  ) {}

  @Post('getUserAuthorizeView')
  async getUserAuthorizeView(@Body() dto: ESCSSearchUserAuthorizeViewDto) {
    return this.userAuthorizeViewService.getUserAuthorizeView(dto);
  }
}
