import { Module } from '@nestjs/common';
import { HeaderService } from './header.service';
import { HeaderController } from './header.controller';
import { M008KP } from '../../as400/rtnlibf/m008kp/entities/m008kp.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([M008KP], 'amecConnection')],
  providers: [HeaderService],
  controllers: [HeaderController],
})
export class HeaderModule {}
