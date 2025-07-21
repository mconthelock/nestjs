import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MethodService } from './method.service';
import { Method } from './entities/method.entity';
import { MethodController } from './method.controller';

@Module({
  controllers: [MethodController],
  imports: [
    TypeOrmModule.forFeature([Method], 'amecConnection')
  ],
  providers: [MethodService],
})
export class MethodModule {}
