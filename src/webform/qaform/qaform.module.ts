import { Module } from '@nestjs/common';
import { QaTypeModule } from './qa_type/qa_type.module';
import { QaFileModule } from './qa_file/qa_file.module';
import { QAInsModule } from './qa-ins/qains.module';
import { RnfrmModule } from './rnfrm/rnfrm.module';
import { RncauseModule } from './rncause/rncause.module';
import { RnlistModule } from './rnlist/rnlist.module';
import { RnlistPpModule } from './rnlist_pp/rnlist_pp.module';
import { RnwasteModule } from './rnwaste/rnwaste.module';
import { RnsolveModule } from './rnsolve/rnsolve.module';
import { RnfrmPartModule } from './rnfrm_part/rnfrm_part.module';
import { WtypeModule } from './wtype/wtype.module';
import { WtypeSecpicModule } from './wtype_secpic/wtype_secpic.module';
import { SecpicModule } from './secpic/secpic.module';
import { RqflistModule } from './rqflist/rqflist.module';
import { RqffrmModule } from './rqffrm/rqffrm.module';
@Module({
    imports: [
        QaFileModule,
        QaTypeModule,
        QAInsModule,
        RnfrmModule,
        RncauseModule,
        RnlistModule,
        RnlistPpModule,
        RnwasteModule,
        RnsolveModule,
        RnfrmPartModule,
        WtypeModule,
        WtypeSecpicModule,
        SecpicModule,
        RqflistModule,
        RqffrmModule,
    ],
})
export class QAFormModule {}
