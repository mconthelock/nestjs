import { Module } from '@nestjs/common';
import { OrgposService } from './orgpos.service';
import { OrgposController } from './orgpos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orgpos } from './entities/orgpos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orgpos], 'amecConnection')],
  controllers: [OrgposController],
  providers: [OrgposService],
  exports: [OrgposService],
})
export class OrgposModule {}
