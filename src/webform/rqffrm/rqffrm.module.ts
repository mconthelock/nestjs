import { Module } from '@nestjs/common';
import { RqffrmService } from './rqffrm.service';
import { RqffrmController } from './rqffrm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RQFFRM } from 'src/common/Entities/webform/table/RQFFRM.entity';
import { FormModule } from '../form/form.module';
import { RqffrmRepository } from './rqffrm.repository';
import { RqflistModule } from '../rqflist/rqflist.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([RQFFRM], 'webformConnection'),
        FormModule,
        RqflistModule,
    ],
    controllers: [RqffrmController],
    providers: [RqffrmService, RqffrmRepository],
    exports: [RqffrmService],
})
export class RqffrmModule {}
