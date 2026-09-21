import { Module } from '@nestjs/common';
import { J736kpService } from './j736kp.service';
import { J736kpController } from './j736kp.controller';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { ConectionService } from 'src/as400/conection/conection.service';

@Module({
    controllers: [J736kpController],
    providers: [J736kpService, ConectionService],
    exports: [J736kpService],
=======
=======
>>>>>>> 093c063b (QA-CN)

@Module({
  controllers: [J736kpController],
  providers: [J736kpService],
<<<<<<< HEAD
>>>>>>> 093c063b (QA-CN)
=======
import { ConectionService } from 'src/as400/conection/conection.service';

@Module({
    controllers: [J736kpController],
    providers: [J736kpService, ConectionService],
    exports: [J736kpService],
>>>>>>> 38e4fc7c (QA-CN)
=======
>>>>>>> 093c063b (QA-CN)
})
export class J736kpModule {}
