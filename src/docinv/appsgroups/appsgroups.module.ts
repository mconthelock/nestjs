import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppsgroupsService } from './appsgroups.service';
import { AppsgroupsController } from './appsgroups.controller';
import { Appsgroup } from '../../common/Entities/docinv/table/appsgroup.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Appsgroup], 'docinvConnection')],
    controllers: [AppsgroupsController],
    providers: [AppsgroupsService],
    exports: [AppsgroupsService],
})
export class AppsgroupsModule {}
