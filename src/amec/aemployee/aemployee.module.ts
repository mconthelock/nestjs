import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AemployeeService } from './aemployee.service';
import { AemployeeController } from './aemployee.controller';
import { AEmployee } from '../../common/Entities/amec/table/AEMPLOYEE.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AEmployee], 'mitsuConnection')],
    controllers: [AemployeeController],
    providers: [AemployeeService],
})
export class AemployeeModule {}
