import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusService } from './status.service';
import { Status } from './entities/status.entity';
import { StatusController } from './status.controller';

@Module({
  controllers: [StatusController],
  imports: [
    TypeOrmModule.forFeature([Status], 'amecConnection')
  ],
  providers: [StatusService],
})
export class StatusModule {}
