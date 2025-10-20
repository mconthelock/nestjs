import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FowarderService } from './fowarder.service';
import { Fowarder } from './entities/fowarder.entity';
import { FowarderController } from './fowarder.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Fowarder], 'invoiceConnection')],
  controllers: [FowarderController],
  providers: [FowarderService],
})
export class FowarderModule {}
