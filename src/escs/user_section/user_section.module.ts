import { Module } from '@nestjs/common';
import { UserSectionService } from './user_section.service';
import { UserSectionController } from './user_section.controller';
import { UserSection } from './entities/user_section.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserSection], 'amecConnection')],
  controllers: [UserSectionController],
  providers: [UserSectionService],
})
export class UserSectionModule {}
