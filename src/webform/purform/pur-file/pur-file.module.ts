import { Module } from '@nestjs/common';
import { PurFileService } from './pur-file.service';
import { PurFileController } from './pur-file.controller';
import { PUR_FILE } from 'src/common/Entities/webform/table/PUR_FILE.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PUR_FILE], 'webformConnection')],
  controllers: [PurFileController],
  providers: [PurFileService],
  exports: [PurFileService],
})
export class PurFileModule {}
