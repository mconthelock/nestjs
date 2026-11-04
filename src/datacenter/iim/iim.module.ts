import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IimService } from './iim.service';
import { IimRepository } from './iim.repository';
import { IimController } from './iim.controller';
import { IIM } from 'src/common/Entities/datacenter/table/IIM.entity';

@Module({
    imports: [TypeOrmModule.forFeature([IIM], 'datacenterConnection')],
    controllers: [IimController],
    providers: [IimService, IimRepository],
    exports: [IimService],
})
export class IimModule {}
