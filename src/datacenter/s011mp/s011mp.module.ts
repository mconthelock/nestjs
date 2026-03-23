import { Module } from '@nestjs/common';
import { S011mpService } from './s011mp.service';
import { S011mpController } from './s011mp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S011MP } from 'src/common/Entities/datacenter/table/S011MP.entity';
import { S011mpRepository } from './s011mp.repository';

@Module({
    imports: [TypeOrmModule.forFeature([S011MP], 'datacenterConnection')],
    controllers: [S011mpController],
    providers: [S011mpService, S011mpRepository],
    exports: [S011mpService],
})
export class S011mpModule {}
