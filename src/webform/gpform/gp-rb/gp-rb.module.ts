import { Module } from '@nestjs/common';
import { GpRbService } from './gp-rb.service';
import { GpRbController } from './gp-rb.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GpRbRepository } from './gp-rb.repository';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { RB_PURPOSE } from 'src/common/Entities/webform/table/GPRB_PURPOSE.entity';

@Module({
  imports:[TypeOrmModule.forFeature([RB_PURPOSE],'webformConnection'),
  FormmstModule,
  FormmstModule
],
  controllers: [GpRbController],
  providers: [GpRbService,GpRbRepository],
  exports:[GpRbService],
})
export class GpRbModule {}
