import { Module } from '@nestjs/common';
import { SequenceOrgService } from './sequence-org.service';
import { SequenceOrgController } from './sequence-org.controller';
import { SequenceOrg } from './entities/sequence-org.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SequenceOrg], 'webformConnection')],
  controllers: [SequenceOrgController],
  providers: [SequenceOrgService],
  exports: [SequenceOrgService],
})
export class SequenceOrgModule {}
