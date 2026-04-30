import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplogsService } from './applogs.service';
import { ApplogsController } from './applogs.controller';
import { SpecialuserModule } from '../specialuser/specialuser.module';

import { AmecappLog } from 'src/common/Entities/itgc/views/amecapp.entity';
import { As400appLog } from 'src/common/Entities/itgc/views/as400app.entity';
import { InvoiceAppLog } from 'src/common/Entities/itgc/views/invoiceapp.entity';
import { MarketingAppLog } from 'src/common/Entities/itgc/views/mktapp.entity';
import { ScmappLog } from 'src/common/Entities/itgc/views/scmapp.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([AmecappLog], 'auditConnection'),
        TypeOrmModule.forFeature([As400appLog], 'auditConnection'),
        TypeOrmModule.forFeature(
            [InvoiceAppLog, MarketingAppLog, ScmappLog],
            'auditConnection',
        ),
        SpecialuserModule,
    ],
    controllers: [ApplogsController],
    providers: [ApplogsService],
})
export class ApplogsModule {}
