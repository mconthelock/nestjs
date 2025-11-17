import { Module } from '@nestjs/common';
import { ESCSUserService } from './user.service';
import { ESCSUserController } from './user.controller';
import { EscsUser } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EscsUser], 'escsConnection')],
  controllers: [ESCSUserController],
  providers: [ESCSUserService],
  exports: [ESCSUserService],
})
export class ESCSUserModule {}
