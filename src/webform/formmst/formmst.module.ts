import { Module } from '@nestjs/common';
import { FormmstService } from './formmst.service';
import { FormmstController } from './formmst.controller';

@Module({
  controllers: [FormmstController],
  providers: [FormmstService],
})
export class FormmstModule {}
