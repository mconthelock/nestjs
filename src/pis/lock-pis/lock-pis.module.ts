import { Module } from '@nestjs/common';
import { LockPisService } from './lock-pis.service';
import { LockPisGateway } from './lock-pis.gateway';
import { UsersModule } from '../../amec/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LockPis } from './entities/lock-pi.entity';
import { LockPisController } from './lock-pis.controller';
import { LockPisDBGateway } from './lock-pisDB.gatewey';

@Module({
  imports: [TypeOrmModule.forFeature([LockPis], 'webformConnection'), UsersModule],
  controllers: [LockPisController],
  providers: [LockPisGateway, LockPisDBGateway, LockPisService],
})
export class LockPisModule {}
