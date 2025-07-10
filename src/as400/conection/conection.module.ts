import { Module } from '@nestjs/common';
import { ConectionService } from './conection.service';

@Module({
  providers: [ConectionService],
  exports: [ConectionService],
})
export class ConectionModule {}
