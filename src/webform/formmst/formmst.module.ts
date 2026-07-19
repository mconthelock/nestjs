import { Module } from '@nestjs/common';
import { FormmstService } from './formmst.service';
import { FormmstController } from './formmst.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormmstRepository } from './formmst.repository';
import { FORMMST } from 'src/common/Entities/webform/table/FORMMST.entity';
import { FORMMST_GROUP } from 'src/common/Entities/webform/table/FORMMST_GROUP.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([FORMMST, FORMMST_GROUP], 'webformConnection'),
    ],
    controllers: [FormmstController],
    providers: [FormmstService, FormmstRepository],
    exports: [FormmstService],
})
export class FormmstModule {}
