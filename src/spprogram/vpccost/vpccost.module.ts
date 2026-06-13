import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VpccostService } from './vpccost.service';
import { VpccostController } from './vpccost.controller';
import { Vpccost } from 'src/common/Entities/datacenter/views/vpccost.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Vpccost], 'datacenterConnection')],
    controllers: [VpccostController],
    providers: [VpccostService],
})
export class VpccostModule {}
