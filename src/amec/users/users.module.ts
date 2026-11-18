import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../../common/Entities/amec/views/user.entity';
import { UsersRepository } from './users.repository';

@Module({
    imports: [TypeOrmModule.forFeature([User], 'mitsuConnection')],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService],
})
export class UsersModule {}
