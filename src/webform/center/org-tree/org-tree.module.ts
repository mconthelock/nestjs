import { Module } from '@nestjs/common';
import { OrgTreeService } from './org-tree.service';
import { OrgTreeController } from './org-tree.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORGTREE } from 'src/common/Entities/webform/table/ORGTREE.entity';
import { OrgTreeRepository } from './org-tree.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ORGTREE], 'webformConnection')],
    controllers: [OrgTreeController],
    providers: [OrgTreeService, OrgTreeRepository],
    exports: [OrgTreeService],
})
export class OrgTreeModule {}
