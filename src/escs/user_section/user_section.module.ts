import { Module } from '@nestjs/common';
import { ESCSUserSectionService } from './user_section.service';
import { ESCSUserSectionController } from './user_section.controller';
import { UserSection } from './entities/user_section.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserSection], 'amecConnection')],
  controllers: [ESCSUserSectionController],
  providers: [ESCSUserSectionService],
})
export class ESCSUserSectionModule {}
