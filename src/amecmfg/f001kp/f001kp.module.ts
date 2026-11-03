import { Module } from '@nestjs/common';
import { ConectionModule } from '../../as400/conection/conection.module';
import { F001kpService } from './f001kp.service';
import { F001kpController } from './f001kp.controller';
import { IetsListModule } from 'src/webform/ieform/ie-ts/iets_list/iets_list.module';

@Module({
    imports: [ConectionModule, IetsListModule],
    controllers: [F001kpController],
    providers: [F001kpService],
})
export class F001kpModule {}
