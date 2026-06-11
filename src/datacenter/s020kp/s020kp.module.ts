import { Module } from '@nestjs/common';
import { S020kpService } from './s020kp.service';
import { S020kpController } from './s020kp.controller';
import { S020kpRepository } from './s020kp.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S020KP } from 'src/common/Entities/datacenter/table/S020KP.entity';

@Module({
    imports: [TypeOrmModule.forFeature([S020KP], 'datacenterConnection')],
    controllers: [S020kpController],
    providers: [S020kpService, S020kpRepository],
    exports: [S020kpService],
})
export class S020kpModule {}
