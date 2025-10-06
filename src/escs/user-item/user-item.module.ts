import { Module } from '@nestjs/common';
import { ESCSUserItemService } from './user-item.service';
import { ESCSUserItemController } from './user-item.controller';
import { ESCSUserItem } from './entities/user-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ESCSUserItem], 'amecConnection')],
  controllers: [ESCSUserItemController],
  providers: [ESCSUserItemService],
  exports: [ESCSUserItemService],
})
export class ESCSUserItemModule {}
