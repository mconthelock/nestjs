import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevplanService } from './devplan.service';
import { DevplanController } from './devplan.controller';
import { DevplanRepository } from './devplan.repository';
import { ISDEV_REQUEST } from 'src/common/Entities/webform/table/ISDEV_REQUEST.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ISDEV_REQUEST], 'webformConnection')],
    controllers: [DevplanController],
    providers: [DevplanService, DevplanRepository],
})
export class DevplanModule {}
