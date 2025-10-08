import { Module } from '@nestjs/common';
import { ESCSUserAuthorizeViewService } from './user-authorize-view.service';
import { ESCSUserAuthorizeViewController } from './user-authorize-view.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ESCSUserAuthorizeView } from './entities/user-authorize-view.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ESCSUserAuthorizeView], 'amecConnection'),
  ],
  controllers: [ESCSUserAuthorizeViewController],
  providers: [ESCSUserAuthorizeViewService],
  exports: [ESCSUserAuthorizeViewService],
})
export class ESCSUserAuthorizeViewModule {}
