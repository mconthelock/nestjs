import { Module } from '@nestjs/common';
import { GenerateIdService } from './services/generate_id.service';
@Module({
  providers: [GenerateIdService],
  exports: [GenerateIdService],
})
export class CommonModule {}
