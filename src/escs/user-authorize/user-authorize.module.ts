import { Module } from '@nestjs/common';
import { UsersAuthorizeService } from './user-authorize.service';
import { UsersAuthorizeController } from './user-authorize.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersAuthorizeRepository } from './user-authorize.repository';

@Module({
    imports: [TypeOrmModule.forFeature([], 'escsConnection')],
    controllers: [UsersAuthorizeController],
    providers: [UsersAuthorizeService, UsersAuthorizeRepository],
    exports: [UsersAuthorizeService],
})
export class UsersAuthorizeModule {}
