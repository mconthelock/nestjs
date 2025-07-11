import { Module } from '@nestjs/common';
import { HeaderService } from './header.service';
import { HeaderController } from './header.controller';
import { M008kpModule } from '../../as400/rtnlibf/m008kp/m008kp.module';

@Module({
  imports: [M008kpModule],
  providers: [HeaderService],
  controllers: [HeaderController],
})
export class HeaderModule {}
