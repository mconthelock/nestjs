import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsDevService } from './is-dev.service';
import { IsDevController } from './is-dev.controller';
import { ISDEV_DEVELOPER } from 'src/common/Entities/webform/table/ISDEV_DEVELOPER.entity';
import { ISDEV_OBJECTIVE } from 'src/common/Entities/webform/table/ISDEV_OBJECTIVE.entity';
import { IS_DEVICEMST } from 'src/common/Entities/webform/table/IS_DEVICEMST.entity';
import { LABORCOST } from 'src/common/Entities/webform/table/LABORCOST.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [ISDEV_DEVELOPER, ISDEV_OBJECTIVE, IS_DEVICEMST, LABORCOST],
            'webformConnection',
        ),
    ],
    controllers: [IsDevController],
    providers: [IsDevService],
})
export class IsDevModule {}
