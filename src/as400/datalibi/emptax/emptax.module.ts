import { Module } from '@nestjs/common';
import { ConectionModule } from 'src/as400/conection/conection.module';

import { EmptaxService } from './emptax.service';
import { EmptaxController } from './emptax.controller';

@Module({
    imports: [ConectionModule],
    controllers: [EmptaxController],
    providers: [EmptaxService],
    exports: [EmptaxService],
})
export class EmptaxModule {}
