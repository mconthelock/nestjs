import { Module } from '@nestjs/common';
import { FormmstService } from './formmst.service';
import { FormmstController } from './formmst.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormmstRepository } from './formmst.repository';
import { FORMMST } from 'src/common/Entities/webform/table/FORMMST.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FORMMST], 'webformConnection')],
    controllers: [FormmstController],
    providers: [FormmstService, FormmstRepository],
    exports: [FormmstService],
})
export class FormmstModule {}
