import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemmasterService } from './itemmaster.service';
import { ItemmasterController } from './itemmaster.controller';

import { IMM_ITEMMST } from 'src/common/Entities/skid/views/IMM_ITEMMST.entity';
import { PART_SHORTAGE_CONTROL } from 'src/common/Entities/skid/table/PART_SHORTAGE_CONTROL.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([IMM_ITEMMST], 'mitsuConnection'),
        TypeOrmModule.forFeature([PART_SHORTAGE_CONTROL], 'mitsuConnection'),
    ],
    controllers: [ItemmasterController],
    providers: [ItemmasterService],
})
export class ItemmasterModule {}
