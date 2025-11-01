import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevisionService } from './revision.service';
import { Revision } from './entities/revision.entity';
import { RevisionController } from './revision.controller';

@Module({
  controllers: [RevisionController],
  imports: [
    TypeOrmModule.forFeature([Revision], 'amecConnection')
  ],
  providers: [RevisionService],
})
export class RevisionModule {}
