import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusstationService } from './busstation.service';
import { Busstation } from './entities/busstation.entity';
import { BusstationController } from './busstation.controller';

@Module({
  controllers: [BusstationController],
  imports: [TypeOrmModule.forFeature([Busstation], 'gpreportConnection')],
  providers: [BusstationService],
})
export class BusstationModule {}
