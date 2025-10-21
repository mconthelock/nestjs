import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModeService } from './mode.service';
import { Mode } from './entities/mode.entity';
import { ModeController } from './mode.controller';

@Module({
  controllers: [ModeController],
  imports: [
    TypeOrmModule.forFeature([Mode], 'amecConnection')
  ],
  providers: [ModeService],
})
export class ModeModule {}
