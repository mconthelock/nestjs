import { Module } from '@nestjs/common';
import { IsFileService } from './is-file.service';
import { IsFileController } from './is-file.controller';
import { IsFile } from './entities/is-file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([IsFile], 'webformConnection')],
  controllers: [IsFileController],
  providers: [IsFileService],
  exports: [IsFileService],
})
export class IsFileModule {}
