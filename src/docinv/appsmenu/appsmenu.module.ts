import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppsmenuService } from './appsmenu.service';
import { AppsmenuController } from './appsmenu.controller';
import { Appsmenu } from './entities/appsmenu.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Appsmenu], 'amecConnection')],
  controllers: [AppsmenuController],
  providers: [AppsmenuService],
})
export class AppsmenuModule {}
