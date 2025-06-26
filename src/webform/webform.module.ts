import { Module } from '@nestjs/common';
import { ISFormModule } from './isform/isform.module';

@Module({
  imports: [ISFormModule],
})
export class WebformModule {}
