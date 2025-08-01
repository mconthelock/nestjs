import { Module } from '@nestjs/common';
import { RepService } from './rep.service';
import { RepController } from './rep.controller';
import { Rep } from './entities/rep.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Rep], 'amecConnection')],
  controllers: [RepController],
  providers: [RepService],
  exports: [RepService],
})
export class RepModule {}
