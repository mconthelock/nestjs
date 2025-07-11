import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { M008kpService } from './m008kp.service';
import { M008kpController } from './m008kp.controller';
import { M008kp } from './entities/m008kp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([M008kp], 'amecConnection')],
  controllers: [M008kpController],
  providers: [M008kpService],
  exports: [M008kpService],
})
export class M008kpModule {}
