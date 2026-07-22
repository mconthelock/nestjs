import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SECPIC } from 'src/common/Entities/webform/table/SECPIC.entity';

import { SecpicController } from './secpic.controller';
import { SecpicRepository } from './secpic.repository';
import { SecpicService } from './secpic.service';

@Module({
  imports: [TypeOrmModule.forFeature([SECPIC], 'webformConnection')],
  controllers: [SecpicController],
  providers: [SecpicService, SecpicRepository],
  exports: [SecpicService],
})
export class SecpicModule {}