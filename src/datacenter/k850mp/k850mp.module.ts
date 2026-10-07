import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { K850mpService } from './k850mp.service';
import { K850mpController } from './k850mp.controller';
import { K850MP } from 'src/common/Entities/datacenter/table/K850mp.entity';
import { K850mpRepository } from './k850mp.repository';

@Module({
    imports: [TypeOrmModule.forFeature([K850MP], 'datacenterConnection')],
    controllers: [K850mpController],
    providers: [K850mpService, K850mpRepository],
    exports: [K850mpService],
})
export class K850mpModule {}
