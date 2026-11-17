import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderdummyService } from './orderdummy.service';
import { OrderdummyController } from './orderdummy.controller';
import { TMARKET_TEMP_DUMMY } from 'src/common/Entities/datacenter/table/TMARKET_TEMP_DUMMY.entity';
import { OrderdummyRepository } from './orderdummy.repository';
import { TMARKET_TEMP } from 'src/common/Entities/datacenter/table/TMARKET_TEMP.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TMARKET_TEMP_DUMMY, TMARKET_TEMP], 'datacenterConnection')],
    controllers: [OrderdummyController],
    providers: [OrderdummyService, OrderdummyRepository],
    exports: [OrderdummyService],
})
export class OrderdummyModule {}
