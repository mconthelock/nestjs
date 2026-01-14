import { Module } from '@nestjs/common';
import { EbgreqformService } from './ebgreqform.service';
import { EbgreqformController } from './ebgreqform.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EBGREQFORM } from 'src/common/Entities/ebudget/table/EBGREQFORM.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EBGREQFORM], 'ebudgetConnection')],
  controllers: [EbgreqformController],
  providers: [EbgreqformService],
  exports: [EbgreqformService],
})
export class EbgreqformModule {}
