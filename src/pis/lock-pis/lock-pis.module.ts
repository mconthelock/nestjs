import { Module } from '@nestjs/common';
import { LockPisService } from './lock-pis.service';
import { LockPisGateway } from './lock-pis.gateway';
import { UsersModule } from '../../amec/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [LockPisGateway, LockPisService],
})
export class LockPisModule {}
