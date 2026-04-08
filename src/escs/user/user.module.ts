import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { USERS } from 'src/common/Entities/escs/table/USERS.entity';

@Module({
    imports: [TypeOrmModule.forFeature([USERS], 'escsConnection')],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService],
})
export class UsersModule {}
