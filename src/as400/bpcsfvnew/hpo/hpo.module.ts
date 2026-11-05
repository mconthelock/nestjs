import { Module } from '@nestjs/common';
import { HpoService } from './hpo.service';
import { HpoController } from './hpo.controller';
import { ConectionModule } from 'src/as400/conection/conection.module';

@Module({
    imports: [ConectionModule],
    controllers: [HpoController],
    providers: [HpoService],
    exports: [HpoService],
})
export class HpoModule {}
