import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDTAG_LOG } from 'src/common/Entities/innovat/table/IDTAG_LOG.entity';
import { IdtagModule } from 'src/innovat/idtag/idtag.module';
import { IdtagJobController } from './idtag-job.controller';
import { IdtagJobRepository } from './idtag-job.repository';
import { IdtagJobService } from './idtag-job.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            IDTAG_LOG,
        ], 'mitsuConnection'),

        IdtagModule,
    ],
    controllers: [
        IdtagJobController,
    ],
    providers: [
        IdtagJobService,
        IdtagJobRepository,
    ],
})
export class IdtagJobModule {}