import { Module } from '@nestjs/common';
import { VpsService } from './vps.service';
import { VpsController } from './vps.controller';
import { VpsRepository } from './vps.repository';
import { ConectionModule } from 'src/as400/conection/conection.module';
import { S011mpModule } from 'src/datacenter/s011mp/s011mp.module';

@Module({
    controllers: [VpsController],
    imports: [ConectionModule, S011mpModule],
    providers: [VpsService, VpsRepository],
})
export class VpsModule {}
