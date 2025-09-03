import { Module } from '@nestjs/common';
import { PsectionService } from './psection.service';
import { PsectionController } from './psection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Psection } from './entities/psection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Psection], 'webformConnection')],
  controllers: [PsectionController],
  providers: [PsectionService],
})
export class PsectionModule {}
