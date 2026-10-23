import { Module } from '@nestjs/common';
import { IetsListService } from './iets_list.service';
import { IetsListController } from './iets_list.controller';
import { IetsListRepository } from './iets_list.repository';

@Module({
    controllers: [IetsListController],
    providers: [IetsListService, IetsListRepository],
    exports: [IetsListService],
})
export class IetsListModule {}
