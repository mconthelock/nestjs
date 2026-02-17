import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaccarrnglstService } from './spaccarrnglst.service';
import { Spaccarrnglst } from './entities/spaccarrnglst.entity';
import { SpaccarrnglstController } from './spaccarrnglst.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Spaccarrnglst], 'elmesConnection')],
  controllers: [SpaccarrnglstController],
  providers: [SpaccarrnglstService],
})
export class SpaccarrnglstModule {}
