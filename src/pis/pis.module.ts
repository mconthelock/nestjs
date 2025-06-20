import { Module } from '@nestjs/common';
<<<<<<< HEAD
=======
import { ConfigModule } from '@nestjs/config';
>>>>>>> b3479b8846c753c0de13c0fb9cae2625a82670ac
import { PisService } from './pis.service';
import { PisGateway } from './pis.gateway';

@Module({
  providers: [PisGateway, PisService],
})
export class PisModule {}
