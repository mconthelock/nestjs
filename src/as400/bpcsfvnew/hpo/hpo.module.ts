import { Module } from '@nestjs/common';
import { HpoService } from './hpo.service';
import { HpoController } from './hpo.controller';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { ConectionService } from 'src/as400/conection/conection.service';

@Module({
    controllers: [HpoController],
    providers: [HpoService, ConectionService],
    exports: [HpoService],
=======
=======
>>>>>>> 093c063b (QA-CN)

@Module({
  controllers: [HpoController],
  providers: [HpoService],
<<<<<<< HEAD
>>>>>>> 093c063b (QA-CN)
=======
import { ConectionService } from 'src/as400/conection/conection.service';

@Module({
    controllers: [HpoController],
    providers: [HpoService, ConectionService],
    exports: [HpoService],
>>>>>>> 38e4fc7c (QA-CN)
=======
>>>>>>> 093c063b (QA-CN)
})
export class HpoModule {}
