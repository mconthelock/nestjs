import { Module } from '@nestjs/common';
import { GrpmstService } from './grpmst.service';
import { GrpmstController } from './grpmst.controller';
import { GRPMST } from 'src/common/Entities/webform/table/GRPMST.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrpmstRepository } from './grpmst.repository';

@Module({
    imports: [TypeOrmModule.forFeature([GRPMST], 'webformConnection')],
    controllers: [GrpmstController],
    providers: [GrpmstService, GrpmstRepository],
    exports: [GrpmstService],
})
export class GrpmstModule {}
