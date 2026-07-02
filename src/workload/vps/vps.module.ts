import { Module } from '@nestjs/common';
import { VpsService } from './vps.service';
import { VpsController } from './vps.controller';
import { VpsRepository } from './vps.repository';
import { ConectionModule } from 'src/as400/conection/conection.module';


@Module({
  controllers: [VpsController],
  imports: [ConectionModule],
  providers: [VpsService, VpsRepository],
})
export class VpsModule {}
