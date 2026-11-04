import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FireItemMst } from 'src/common/Entities/gpreport/table/FIRE_ITEM_MST.entity';
import { FireController } from './fire.controller';
import { FireService } from './fire.service';
import { FireRepository } from './fire.repository';

@Module({
    imports: [TypeOrmModule.forFeature([FireItemMst], 'mitsuConnection')],
    controllers: [FireController],
    providers: [FireService, FireRepository],
    exports: [FireService, FireRepository],
})
export class FireModule {}
