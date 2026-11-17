import { Module } from '@nestjs/common';
import { UsersAuthorizeService } from './user-authorize.service';
import { UsersAuthorizeController } from './user-authorize.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersAuthorizeRepository } from './user-authorize.repository';
import { USERS_AUTHORIZE } from 'src/common/Entities/escs/table/USERS_AUTHORIZE.entity';

@Module({
    imports: [TypeOrmModule.forFeature([USERS_AUTHORIZE], 'mitsuConnection')],
    controllers: [UsersAuthorizeController],
    providers: [UsersAuthorizeService, UsersAuthorizeRepository],
    exports: [UsersAuthorizeService],
})
export class UsersAuthorizeModule {}
