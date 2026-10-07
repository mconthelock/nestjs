import { Module } from '@nestjs/common';
import { HpoService } from './hpo.service';
import { HpoController } from './hpo.controller';
import { ConectionService } from 'src/as400/conection/conection.service';

@Module({
    controllers: [HpoController],
    providers: [HpoService, ConectionService],
    exports: [HpoService],
})
export class HpoModule {}
