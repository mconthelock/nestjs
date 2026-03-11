import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderdummyService } from './orderdummy.service';
import { OrderdummyController } from './orderdummy.controller';
import { Orderdummy } from './entities/orderdummy.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Orderdummy], 'datacenterConnection')],
    controllers: [OrderdummyController],
    providers: [OrderdummyService],
})
export class OrderdummyModule {}
