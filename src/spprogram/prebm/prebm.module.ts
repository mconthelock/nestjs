import { Module } from '@nestjs/common';
import { ConectionModule } from 'src/as400/conection/conection.module';

import { PrebmService } from './prebm.service';
import { PrebmController } from './prebm.controller';
@Module({
  imports: [ConectionModule],
  controllers: [PrebmController],
  providers: [PrebmService],
})
export class PrebmModule {}
