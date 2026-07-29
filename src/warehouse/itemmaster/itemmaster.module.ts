import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemmasterService } from './itemmaster.service';
import { ItemmasterController } from './itemmaster.controller';

import { IMM_ITEMMST } from 'src/common/Entities/skid/views/IMM_ITEMMST.entity';

@Module({
    imports: [TypeOrmModule.forFeature([IMM_ITEMMST], 'webformConnection')],
    controllers: [ItemmasterController],
    providers: [ItemmasterService],
})
export class ItemmasterModule {}
