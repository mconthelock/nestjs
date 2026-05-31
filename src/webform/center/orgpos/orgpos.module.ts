import { Module } from '@nestjs/common';
import { OrgposService } from './orgpos.service';
import { OrgposController } from './orgpos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrgposRepository } from './orgpos.repository';
import { ORGPOS } from 'src/common/Entities/webform/table/ORGPOS.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ORGPOS], 'webformConnection')],
    controllers: [OrgposController],
    providers: [OrgposService, OrgposRepository],
    exports: [OrgposService],
})
export class OrgposModule {}
