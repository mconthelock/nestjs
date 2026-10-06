import { Module } from '@nestjs/common';
import { ConectionModule } from 'src/as400/conection/conection.module';
import { IimController } from './iim.controller';
import { IimService } from './iim.service';

@Module({
    imports: [ConectionModule],
    controllers: [IimController],
    providers: [IimService],
    exports: [IimService],
})
export class IimModule {}
