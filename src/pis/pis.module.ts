import { Module } from '@nestjs/common';
import { PisService } from './pis.service';
import { PisGateway } from './pis.gateway';

@Module({
  providers: [PisGateway, PisService],
})
export class PisModule {}
