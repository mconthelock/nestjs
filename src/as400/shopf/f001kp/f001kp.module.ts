import { Module } from '@nestjs/common';
import { ConectionModule } from '../../conection/conection.module';
import { F001kpService } from './f001kp.service';
import { F001kpController } from './f001kp.controller';

@Module({
  imports: [ConectionModule],
  controllers: [F001kpController],
  providers: [F001kpService],
})
export class F001kpModule {}
