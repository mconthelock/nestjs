import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemarrnglstService } from './itemarrnglst.service';
import { Itemarrnglst } from './entities/itemarrnglst.entity';
import { ItemarrnglstController } from './itemarrnglst.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Itemarrnglst], 'elmesConnection')],
  controllers: [ItemarrnglstController],
  providers: [ItemarrnglstService],
  exports: [ItemarrnglstService],
})
export class ItemarrnglstModule {}
