import { Module } from '@nestjs/common';
import { UsersAuthorizeViewService } from './user-authorize-view.service';
import { UsersAuthorizeViewController } from './user-authorize-view.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USERS_AUTHORIZE_VIEW } from 'src/common/Entities/escs/views/USERS_AUTHORIZE_VIEW.entity';
import { UsersAuthorizeViewRepository } from './user-authorize-view.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([USERS_AUTHORIZE_VIEW], 'escsConnection'),
    ],
    controllers: [UsersAuthorizeViewController],
    providers: [UsersAuthorizeViewService, UsersAuthorizeViewRepository],
    exports: [UsersAuthorizeViewService],
})
export class UsersAuthorizeViewModule {}
