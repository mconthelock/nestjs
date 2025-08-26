import { Module } from '@nestjs/common';
import { ESCSUserService } from './user.service';
import { ESCSUserController } from './user.controller';
import { EscsUser } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EscsUser], 'amecConnection')],
  controllers: [ESCSUserController],
  providers: [ESCSUserService],
})
export class ESCSUserModule {}
