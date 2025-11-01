import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramService } from './program.service';
import { Program } from './entities/program.entity';
import { ProgramController } from './program.controller';

@Module({
  controllers: [ProgramController],
  imports: [
    TypeOrmModule.forFeature([Program], 'amecConnection')
  ],
  providers: [ProgramService],
})
export class ProgramModule {}
