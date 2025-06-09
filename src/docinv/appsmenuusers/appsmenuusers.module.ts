import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppsmenuusersService } from './appsmenuusers.service';
import { AppsmenuusersController } from './appsmenuusers.controller';
import { Appsmenuuser } from './entities/appsmenuuser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appsmenuuser], 'amecConnection')],
  controllers: [AppsmenuusersController],
  providers: [AppsmenuusersService],
})
export class AppsmenuusersModule {}
