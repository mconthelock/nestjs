import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JigController } from './jig.controller';
import { JigService } from './jig.service';
import { JigRepository } from './jig.repository';
import { JigMaster } from 'src/common/Entities/iedoc/table/jig_master.entity';
import { JigCheckpoint } from 'src/common/Entities/iedoc/table/jig_checkpoint.entity';
import { JigForm } from 'src/common/Entities/iedoc/table/jig_form.entity';
import { JigFormDetail } from 'src/common/Entities/iedoc/table/jig_form_detail.entity';
import { JigFormNg } from 'src/common/Entities/iedoc/table/jig_form_ng.entity';
import { JigFormFile } from 'src/common/Entities/iedoc/table/jig_form_file.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                JigMaster,
                JigCheckpoint,
                JigForm,
                JigFormDetail,
                JigFormNg,
                JigFormFile,
            ],
            'iedocConnection',
        ),
    ],
    controllers: [JigController],
    providers: [JigService, JigRepository],
    exports: [JigService, JigRepository],
})
export class JigModule {}
