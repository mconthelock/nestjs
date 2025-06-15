import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccesslogService } from './accesslog.service';
import { AccesslogController } from './accesslog.controller';
import { Accesslog } from './entities/accesslog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accesslog], 'amecConnection')],
  controllers: [AccesslogController],
  providers: [AccesslogService],
  exports: [AccesslogService],
})
export class AccesslogModule {}
