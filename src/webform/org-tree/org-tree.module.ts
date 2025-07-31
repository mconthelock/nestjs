import { Module } from '@nestjs/common';
import { OrgTreeService } from './org-tree.service';
import { OrgTreeController } from './org-tree.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { OrgTree } from './entities/org-tree.entity';

@Module({
  controllers: [OrgTreeController],
  providers: [OrgTreeService],
  exports: [OrgTreeService],
  imports: [
    TypeOrmModule.forFeature([OrgTree], 'webformConnection'),
  ]
})
export class OrgTreeModule {}
