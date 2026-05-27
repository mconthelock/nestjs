import { Module } from '@nestjs/common';
import { PurnvfAddressService } from './purnvf_address.service';
import { PurnvfAddressController } from './purnvf_address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PURNVF_ADDRESS } from 'src/common/Entities/webform/table/PURVNF_ADDRESS.entity';
import { PurnvfAddressRepository } from './purnvf_address.repository';  
import { PurnvfFormRepository } from '../purnvf_form/purnvf_form.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PURNVF_ADDRESS], 'webformConnection')],
  controllers: [PurnvfAddressController],
  providers: [PurnvfAddressService,PurnvfFormRepository],
  exports: [PurnvfAddressService],
})
export class PurnvfAddressModule {}
