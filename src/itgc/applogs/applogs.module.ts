import { Module } from '@nestjs/common';
import { ApplogsService } from './applogs.service';
import { ApplogsController } from './applogs.controller';

@Module({
  controllers: [ApplogsController],
  providers: [ApplogsService],
})
export class ApplogsModule {}
