import { Module } from '@nestjs/common';
import { StyImageService } from './sty-image.service';
import { StyImageController } from './sty-image.controller';

@Module({
  controllers: [StyImageController],
  providers: [StyImageService],
})
export class StyImageModule {}
