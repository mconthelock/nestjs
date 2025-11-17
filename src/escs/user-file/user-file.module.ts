import { Module } from '@nestjs/common';
import { ESCSUserFileService } from './user-file.service';
import { ESCSUserFileController } from './user-file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ESCSUserFile } from './entities/user-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ESCSUserFile], 'escsConnection')],
  controllers: [ESCSUserFileController],
  providers: [ESCSUserFileService],
  exports: [ESCSUserFileService],
})
export class ESCSUserFileModule {}
