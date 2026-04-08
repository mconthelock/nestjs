import { Module } from '@nestjs/common';
import { SequenceOrgService } from './sequence-org.service';
import { SequenceOrgController } from './sequence-org.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SEQUENCEORG } from 'src/common/Entities/webform/table/SEQUENCEORG.entity';
import { SequenceOrgRepository } from './sequence-org.repository';

@Module({
    imports: [TypeOrmModule.forFeature([SEQUENCEORG], 'webformConnection')],
    controllers: [SequenceOrgController],
    providers: [SequenceOrgService, SequenceOrgRepository],
    exports: [SequenceOrgService],
})
export class SequenceOrgModule {}
