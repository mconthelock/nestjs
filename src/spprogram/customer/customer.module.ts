import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CustomerController } from './customer.controller';

@Module({
  controllers: [CustomerController],
  imports: [TypeOrmModule.forFeature([Customer], 'spsysConnection')],
  providers: [CustomerService],
})
export class CustomerModule {}
