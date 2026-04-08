import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmecUserAllService } from './amecuserall.service';
import { AmecUserAllController } from './amecuserall.controller';
import { AmecUserAllRepository } from './amecuserall.repository';
import { AMECUSERALL } from 'src/common/Entities/amec/views/AMECUSERALL.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AMECUSERALL], 'amecConnection')],
  controllers: [AmecUserAllController],
  providers: [AmecUserAllService, AmecUserAllRepository],
  exports: [AmecUserAllService],
})
export class AmecUserAllModule {}
