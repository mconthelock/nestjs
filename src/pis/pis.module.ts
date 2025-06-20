import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PisService } from './pis.service';
import { PisGateway } from './pis.gateway';

@Module({
  providers: [PisGateway, PisService],
})
export class PisModule {}
