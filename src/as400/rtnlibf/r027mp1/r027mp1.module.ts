import { Module } from '@nestjs/common';
import { ConectionModule } from 'src/as400/conection/conection.module';
import { R027mp1Service } from './r027mp1.service';
import { R027mp1Controller } from './r027mp1.controller';

@Module({
    imports: [ConectionModule],
    controllers: [R027mp1Controller],
    providers: [R027mp1Service],
    exports: [R027mp1Service],
})
export class R027mp1Module {}
