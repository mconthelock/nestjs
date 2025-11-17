import { Module } from '@nestjs/common';
import { FilesController } from './file.controller';
import { CommonModule } from '../common/common.module';
import { FileService } from './file.service';

@Module({
  imports: [CommonModule],
  controllers: [FilesController],
  providers: [FileService],
  exports: [FileService],
})
export class FilesModule {}
