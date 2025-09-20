import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrdevicemstService } from './crdevicemst.service';
import { Crdevicemst } from './entities/crdevicemst.entity';
import { CrdevicemstController } from './crdevicemst.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Crdevicemst], 'webformConnection')],
  controllers: [CrdevicemstController],
  providers: [CrdevicemstService],
})
export class CrdevicemstModule {}
