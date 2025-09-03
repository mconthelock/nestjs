import { Module } from '@nestjs/common';
import { AvmService } from './avm.service';
import { AvmController } from './avm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avm } from './entities/avm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Avm], 'amecConnection')],
  controllers: [AvmController],
  providers: [AvmService],
  exports: [AvmService],
})
export class AvmModule {}
