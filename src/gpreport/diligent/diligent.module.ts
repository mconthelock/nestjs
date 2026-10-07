import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DiligentService } from './diligent.service';
import { DiligentController } from './diligent.controller';

import { Diligent } from 'src/common/Entities/gpreport/views/DILIGENT.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Diligent], 'gpreportConnection')],
    controllers: [DiligentController],
    providers: [DiligentService],
})
export class DiligentModule {}
