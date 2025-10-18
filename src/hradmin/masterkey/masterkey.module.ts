import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterkeyService } from './masterkey.service';
import { Masterkey } from './entities/masterkey.entity';
import { MasterkeyController } from './masterkey.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Masterkey], 'amecConnection')],
  controllers: [MasterkeyController],
  providers: [MasterkeyService],
  exports: [MasterkeyService],
})
export class MasterkeyModule {}
