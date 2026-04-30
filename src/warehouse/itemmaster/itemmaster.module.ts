import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemmasterService } from './itemmaster.service';
import { ItemmasterController } from './itemmaster.controller';

import { ImmItemmst } from 'src/common/Entities/skid/views/imm_itemmst.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ImmItemmst], 'webformConnection')],
    controllers: [ItemmasterController],
    providers: [ItemmasterService],
})
export class ItemmasterModule {}
