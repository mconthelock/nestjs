import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsDevService } from './is-dev.service';
import { IsDevController } from './is-dev.controller';
import { ISDEV_DEVELOPER } from 'src/common/Entities/webform/table/ISDEV_DEVELOPER.entity';
import { ISDEV_OBJECTIVE } from 'src/common/Entities/webform/table/ISDEV_OBJECTIVE.entity';
import { IS_DEVICEMST } from 'src/common/Entities/webform/table/IS_DEVICEMST.entity';
import { LABORCOST } from 'src/common/Entities/webform/table/LABORCOST.entity';
import { ISDEV_REQUEST } from 'src/common/Entities/webform/table/ISDEV_REQUEST.entity';
import { IsDevFormRepository } from './is-dev.repositoty';
import { FormModule } from 'src/webform/form/form.module';
import { HandleFileFormModule } from 'src/webform/handle-file-form/handle-file-form.module';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                ISDEV_REQUEST,
                ISDEV_DEVELOPER,
                ISDEV_OBJECTIVE,
                IS_DEVICEMST,
                LABORCOST,
            ],
            'webformConnection',
        ),
        FormModule,
        HandleFileFormModule,
    ],
    controllers: [IsDevController],
    providers: [IsDevService, IsDevFormRepository],
})
export class IsDevModule {}
