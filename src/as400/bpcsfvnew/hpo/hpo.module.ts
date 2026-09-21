import { Module } from '@nestjs/common';
import { HpoService } from './hpo.service';
import { HpoController } from './hpo.controller';
<<<<<<< HEAD
import { ConectionService } from 'src/as400/conection/conection.service';

@Module({
    controllers: [HpoController],
    providers: [HpoService, ConectionService],
    exports: [HpoService],
=======

@Module({
  controllers: [HpoController],
  providers: [HpoService],
>>>>>>> 093c063b (QA-CN)
})
export class HpoModule {}
