import { Module } from '@nestjs/common';
import { StyItemsService } from './sty-items.service';
import { StyItemsController } from './sty-items.controller';
import { StyItemsRepository } from './sty-items.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { STY_ITEMS } from 'src/common/Entities/gpreport/table/STY_ITEMS.entity';

@Module({
    imports: [TypeOrmModule.forFeature([STY_ITEMS], 'gpreportConnection')],
    controllers: [StyItemsController],
    providers: [StyItemsService, StyItemsRepository],
    exports: [StyItemsService],
})
export class StyItemsModule {}
