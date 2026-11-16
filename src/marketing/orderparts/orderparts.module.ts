import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderpartsService } from './orderparts.service';
import { OrderpartsController } from './orderparts.controller';
import { Orderpart } from './entities/orderpart.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Orderpart], 'mitsuConnection')],
    controllers: [OrderpartsController],
    providers: [OrderpartsService],
})
export class OrderpartsModule {}
