import { Module } from '@nestjs/common';
import { ESCSUserItemService } from './user-item.service';
import { ESCSUserItemController } from './user-item.controller';

@Module({
  controllers: [ESCSUserItemController],
  providers: [ESCSUserItemService],
})
export class ESCSUserItemModule {}
