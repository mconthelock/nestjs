import { Module } from '@nestjs/common';
import { ESCSUserAuthorizeService } from './user-authorize.service';
import { ESCSUserAuthorizeController } from './user-authorize.controller';
import { ESCSUserAuthorize } from './entities/user-authorize.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ESCSUserAuthorize], 'escsConnection')],
  controllers: [ESCSUserAuthorizeController],
  providers: [ESCSUserAuthorizeService],
  exports: [ESCSUserAuthorizeService],
})
export class ESCSUserAuthorizeModule {}
