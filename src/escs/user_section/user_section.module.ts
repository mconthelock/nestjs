import { Module } from '@nestjs/common';
import { UsersSectionService } from './user_section.service';
import { UsersSectionController } from './user_section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersSectionRepository } from './user_section.repository';
import { USERS_SECTION } from 'src/common/Entities/escs/table/USERS_SECTION.entity';

@Module({
    imports: [TypeOrmModule.forFeature([USERS_SECTION], 'escsConnection')],
    controllers: [UsersSectionController],
    providers: [UsersSectionService, UsersSectionRepository],
    exports: [UsersSectionService],
})
export class UsersSectionModule {}
