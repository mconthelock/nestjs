import { Module } from '@nestjs/common';
import { PdivisionService } from './pdivision.service';
import { PdivisionController } from './pdivision.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pdivision } from '../../common/Entities/amec/table/PDIVISION.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Pdivision], 'mitsuConnection')],
    controllers: [PdivisionController],
    providers: [PdivisionService],
})
export class PdivisionModule {}
