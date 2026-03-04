import { Module } from '@nestjs/common';
import { PproductService } from './pproduct.service';
import { PproductController } from './pproduct.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pproduct } from './entities/pproduct.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pproduct], 'webformConnection')],
  controllers: [PproductController],
  providers: [PproductService],
})
export class PproductModule {}
