import { Module } from '@nestjs/common';
import { QuotationService } from './ebudget-quotation.service';
import { QuotationController } from './ebudget-quotation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { RQFFRM } from 'src/common/Entities/webform/tables/RQFFRM.entity';
// import { RQFLIST } from 'src/common/Entities/webform/tables/RQFLIST.entity';

@Module({
//   imports: [
//     TypeOrmModule.forFeature([RQFFRM], 'webformConnection'),
//     TypeOrmModule.forFeature([RQFLIST], 'webformConnection'),
//   ],
  controllers: [QuotationController],
  providers: [QuotationService],
  exports: [QuotationService],
})
export class QuotationModule {}
