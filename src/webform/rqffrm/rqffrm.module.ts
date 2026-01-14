import { Module } from '@nestjs/common';
import { RqffrmService } from './rqffrm.service';
import { RqffrmController } from './rqffrm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RQFFRM } from 'src/common/Entities/webform/tables/RQFFRM.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RQFFRM], 'webformConnection')],
  controllers: [RqffrmController],
  providers: [RqffrmService],
  exports: [RqffrmService],
})
export class RqffrmModule {}
