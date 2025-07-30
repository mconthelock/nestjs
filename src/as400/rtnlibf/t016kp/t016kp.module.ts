import { Module } from '@nestjs/common';
import { T016kpService } from './t016kp.service';
import { T016kpController } from './t016kp.controller';
import { ConectionModule } from '../../conection/conection.module';

@Module({
  imports: [ConectionModule],
  controllers: [T016kpController],
  providers: [T016kpService],
})
export class T016kpModule {}
