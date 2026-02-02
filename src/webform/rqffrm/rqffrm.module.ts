import { Module } from '@nestjs/common';
import { RqffrmService } from './rqffrm.service';
import { RqffrmController } from './rqffrm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RQFFRM } from 'src/common/Entities/webform/table/RQFFRM.entity';
import { FormModule } from '../form/form.module';

@Module({
  imports: [TypeOrmModule.forFeature([RQFFRM], 'webformConnection'), FormModule],
  controllers: [RqffrmController],
  providers: [RqffrmService],
  exports: [RqffrmService],
})
export class RqffrmModule {}
