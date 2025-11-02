import { Module } from '@nestjs/common';
import { FormmstService } from './formmst.service';
import { FormmstController } from './formmst.controller';
import { Formmst } from './entities/formmst.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Formmst], 'webformConnection')],
  controllers: [FormmstController],
  providers: [FormmstService],
  exports: [FormmstService],
})
export class FormmstModule {}
