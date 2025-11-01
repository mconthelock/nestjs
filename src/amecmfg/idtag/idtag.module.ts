import { Module } from '@nestjs/common';
import { IdtagService } from './idtag.service';
import { IdtagController } from './idtag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { M008KP } from 'src/as400/rtnlibf/m008kp/entities/m008kp.entity';
@Module({
  imports: [TypeOrmModule.forFeature([M008KP], 'amecConnection')],
  controllers: [IdtagController],
  providers: [IdtagService],
})
export class IdtagModule {}
