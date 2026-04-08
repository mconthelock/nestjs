import { Module } from '@nestjs/common';
import { UsersFileService } from './user-file.service';
import { UsersFileController } from './user-file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersFileRepository } from './user-file.repository';
import { USERS_FILES } from 'src/common/Entities/escs/table/USERS_FILES.entity';

@Module({
    imports: [TypeOrmModule.forFeature([USERS_FILES], 'escsConnection')],
    controllers: [UsersFileController],
    providers: [UsersFileService, UsersFileRepository],
    exports: [UsersFileService],
})
export class UsersFileModule {}
