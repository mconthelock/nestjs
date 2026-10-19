import { Module } from '@nestjs/common';
import { R027Mp1Service } from './r027mp1.service';
import { R027Mp1Controller } from './r027mp1.controller';
import { ConectionModule } from 'src/as400/conection/conection.module';

@Module({
    imports: [ConectionModule],
    controllers: [R027Mp1Controller],
    providers: [R027Mp1Service],
    exports: [R027Mp1Service],
})
export class R027Mp1Module {}
