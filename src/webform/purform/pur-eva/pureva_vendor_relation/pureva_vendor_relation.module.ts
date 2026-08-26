import { Module } from '@nestjs/common';
import { PurevaVendorRelationService } from './pureva_vendor_relation.service';
import { PurevaVendorRelationController } from './pureva_vendor_relation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurevaRelationRepository } from './pureva_vendor_relation.repository';
import { PUREVA_VENDOR_RELATION } from 'src/common/Entities/webform/table/PUREVA_VENDOR_RELATION.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PUREVA_VENDOR_RELATION], 'webformConnection')],
  controllers: [PurevaVendorRelationController],
  providers: [PurevaVendorRelationService , PurevaRelationRepository],
  exports:[PurevaVendorRelationService]
})
export class PurevaVendorRelationModule {}



