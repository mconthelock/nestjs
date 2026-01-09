import { Module } from '@nestjs/common';
import { IdtagService } from './idtag.service';
import { IdtagController } from './idtag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { M008KP } from 'src/as400/rtnlibf/m008kp/entities/m008kp.entity';
import { F110KP } from 'src/amecmfg/f110kp/entities/f110kp.entity';
import { F001KP } from 'src/as400/shopf/f001kp/entities/f001kp.entity';
@Module({
  imports: [TypeOrmModule.forFeature([M008KP, F110KP, F001KP], 'amecConnection')],
  controllers: [IdtagController],
  providers: [IdtagService],
})
export class IdtagModule {}
