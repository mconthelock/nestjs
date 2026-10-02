import { Module } from '@nestjs/common';
import { R027Mp1Service } from './r027mp1.service';
import { R027Mp1Controller } from './r027mp1.controller';
import { ConectionService } from 'src/as400/conection/conection.service';

@Module({
    controllers: [R027Mp1Controller],
    providers: [R027Mp1Service, ConectionService],
    exports: [R027Mp1Service],
})
export class R027Mp1Module {}
