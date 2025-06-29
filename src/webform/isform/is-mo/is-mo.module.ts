import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsMoService } from './is-mo.service';
import { IsMoController } from './is-mo.controller';
import { IsMo } from './entities/is-mo.entity';
@Module({
  imports: [TypeOrmModule.forFeature([IsMo], 'amecConnection')],
  controllers: [IsMoController],
  providers: [IsMoService],
})
export class IsMoModule {}
