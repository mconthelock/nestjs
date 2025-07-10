import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeaderService } from './header.service';
import { HeaderController } from './header.controller';

import { F001KP } from 'src/as400/shopf/f001kp/entities/f001kp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([F001KP], 'amecConnection')],
  providers: [HeaderService],
  controllers: [HeaderController],
})
export class HeaderModule {}
