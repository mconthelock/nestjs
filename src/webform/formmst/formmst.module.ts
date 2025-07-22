import { Module } from '@nestjs/common';
import { FormmstService } from './formmst.service';
import { FormmstController } from './formmst.controller';
import { Formmst } from './entities/formmst.entity';
import { Formmstts } from './entities/formmstts.entity';
import { TypeOrmModule } from '@nestjs/typeorm'; 

@Module({
  imports: [TypeOrmModule.forFeature([Formmst, Formmstts], 'amecConnection')],
  controllers: [FormmstController],
  providers: [FormmstService],
  exports: [FormmstService],
})
export class FormmstModule {}
