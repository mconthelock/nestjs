
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { OvertimeController } from './overtime.controller';
import { Overtime } from 'src/common/Entities/gpreport/table/overtime.entity';



@Module({
  imports: [TypeOrmModule.forFeature([Overtime], 'gpreportConnection')],
  controllers: [OvertimeController],
  providers: [OvertimeService],
})

export class OvertimeModule {}

