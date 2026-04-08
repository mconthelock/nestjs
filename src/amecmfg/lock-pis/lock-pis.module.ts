import { Module } from '@nestjs/common';
import { LockPisService } from './lock-pis.service';
import { LockPisGateway } from './lock-pis.gateway';
import { UsersModule } from '../../amec/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LockPis } from './entities/lock-pi.entity';
import { LockPisController } from './lock-pis.controller';
import { LockPisDBGateway } from './lock-pisDB.gatewey';
import { RedisModule } from 'src/common/redis/redis.module';
// import {
//     redisProvider,
//     redisSubProvider,
// } from 'src/common/redis/redis.provider';

@Module({
    imports: [
        TypeOrmModule.forFeature([LockPis], 'webformConnection'),
        UsersModule,
        RedisModule,
    ],
    controllers: [LockPisController],
    providers: [
        LockPisGateway,
        LockPisDBGateway,
        LockPisService,
        // redisProvider,
        // redisSubProvider,
    ],
})
export class LockPisModule {}
