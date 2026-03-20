import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderdummyService } from './orderdummy.service';
import { OrderdummyController } from './orderdummy.controller';
import { TMARKET_TEMP_DUMMY } from 'src/common/Entities/datacenter/table/TMARKET_TEMP_DUMMY.entity';
import { OrderdummyRepository } from './orderdummy.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([TMARKET_TEMP_DUMMY], 'datacenterConnection'),
    ],
    controllers: [OrderdummyController],
    providers: [OrderdummyService, OrderdummyRepository],
    exports: [OrderdummyService],
})
export class OrderdummyModule {}
