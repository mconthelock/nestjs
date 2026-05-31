import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FORMMST_GROUP } from 'src/common/Entities/webform/table/FORMMST_GROUP.entity';

import { FormmstGroupService } from './formmst-group.service';
import { FormmstGroupController } from './formmst-group.controller';

@Module({
    imports: [TypeOrmModule.forFeature([FORMMST_GROUP], 'webformConnection')],
    controllers: [FormmstGroupController],
    providers: [FormmstGroupService],
})
export class FormmstGroupModule {}
