import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VPSService } from './vps.service';
import { VPSController } from './vps.controller';
import { LogMethodErr } from './entities/log-method-err.entity';
import { PackingMas } from './entities/packing-mas.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                LogMethodErr,
                PackingMas,
            ],
            'packingConnection',
        ),
    ],
    controllers: [VPSController],
    providers: [VPSService],
})
export class VPSModule {}