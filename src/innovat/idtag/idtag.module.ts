import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { F002kpModule } from 'src/as400/shopf/f002kp/f002kp.module';
import { IDTAG_LOG } from 'src/common/Entities/innovat/table/IDTAG_LOG.entity';
import { IdtagController } from './idtag.controller';
import { IdtagRepository } from './idtag.repository';
import { IdtagService } from './idtag.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            IDTAG_LOG,
        ], 'mitsuConnection'),

        F002kpModule,
    ],
    controllers: [
        IdtagController,
    ],
    providers: [
        IdtagService,
        IdtagRepository,
    ],
})
export class IdtagModule {}