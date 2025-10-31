import { Module } from '@nestjs/common';
import { IdtagService } from './idtag.service';
import { IdtagController } from './idtag.controller';
import { ConectionModule } from 'src/as400/conection/conection.module';

@Module({
  imports: [ConectionModule],
  controllers: [IdtagController],
  providers: [IdtagService],
})
export class IdtagModule {}
