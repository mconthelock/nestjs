import { Module } from '@nestjs/common';
import { PurVendorsCodeService } from './pur_vendors_code.service';
import { PurVendorsCodeController } from './pur_vendors_code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurVendorsCode } from './entities/pur_vendors_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurVendorsCode], 'purConnection')],
  controllers: [PurVendorsCodeController],
  providers: [PurVendorsCodeService],
})
export class PurVendorsCodeModule {}
