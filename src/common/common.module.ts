import { Module } from '@nestjs/common';
import { GenerateIdService } from './services/generate_id.service';
import { FileService } from './services/file.service';
@Module({
  providers: [GenerateIdService, FileService],
  exports: [GenerateIdService, FileService],
})
export class CommonModule {}
