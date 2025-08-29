import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemarrnglstService } from './itemarrnglst.service';
import { Itemarrnglst } from './entities/itemarrnglst.entity';
import { ItemarrnglstController } from './itemarrnglst.controller';

@Module({
  controllers: [ItemarrnglstController],
  imports: [TypeOrmModule.forFeature([Itemarrnglst], 'spsysConnection')],
  providers: [ItemarrnglstService],
})
export class ItemarrnglstModule {}
