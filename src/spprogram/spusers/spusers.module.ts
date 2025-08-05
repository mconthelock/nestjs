import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpusersService } from './spusers.service';
import { SpusersController } from './spusers.controller';
import { UsersModule } from 'src/amec/users/users.module';

import { Spusers } from './entities/spusers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Spusers], 'amecConnection'), UsersModule],
  controllers: [SpusersController],
  providers: [SpusersService],
})
export class SpusersModule {}
