import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaccarrnglstService } from './spaccarrnglst.service';
import { Spaccarrnglst } from './entities/spaccarrnglst.entity';
import { SpaccarrnglstController } from './spaccarrnglst.controller';
import { ItemarrnglstModule } from '../itemarrnglst/itemarrnglst.module';

@Module({
  imports: [
    ItemarrnglstModule,
    TypeOrmModule.forFeature([Spaccarrnglst], 'elmesConnection'),
  ],
  controllers: [SpaccarrnglstController],
  providers: [SpaccarrnglstService],
})
export class SpaccarrnglstModule {}
