import { Module } from '@nestjs/common';
import { ShortageService } from './shortage.service';
import { ShortageController } from './shortage.controller';
import { ShortageRepository } from './shortage.repository';
import { ConectionModule } from 'src/as400/conection/conection.module';

@Module({
  controllers: [ShortageController],
  providers: [ShortageService, ShortageRepository],
  imports: [ConectionModule],
})
export class ShortageModule { }
