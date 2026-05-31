import { Module } from '@nestjs/common';
import { FormmstGroupService } from './formmst-group.service';
import { FormmstGroupController } from './formmst-group.controller';

@Module({
  controllers: [FormmstGroupController],
  providers: [FormmstGroupService],
})
export class FormmstGroupModule {}
