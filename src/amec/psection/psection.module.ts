import { Module } from '@nestjs/common';
import { PsectionService } from './psection.service';
import { PsectionController } from './psection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Psection } from '../../common/Entities/amec/table/PSECTION.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Psection], 'mitsuConnection')],
    controllers: [PsectionController],
    providers: [PsectionService],
})
export class PsectionModule {}
