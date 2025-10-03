import { Module } from '@nestjs/common';
import { ESCSUserAuthorizeService } from './user-authorize.service';
import { ESCSUserAuthorizeController } from './user-authorize.controller';

@Module({
  controllers: [ESCSUserAuthorizeController],
  providers: [ESCSUserAuthorizeService],
})
export class ESCSUserAuthorizeModule {}
