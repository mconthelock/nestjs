import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuspassengerService } from './buspassenger.service';
import { BuspassengerController } from './buspassenger.controller';
import { Buspassenger } from 'src/common/Entities/gpreport/table/buspassenger.entity';
import { User } from 'src/amec/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Buspassenger, User], 'gpreportConnection')],
  controllers: [BuspassengerController],
  providers: [BuspassengerService],
})
export class BuspassengerModule {}
