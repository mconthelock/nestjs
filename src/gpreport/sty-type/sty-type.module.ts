import { Module } from '@nestjs/common';
import { StyTypeService } from './sty-type.service';
import { StyTypeController } from './sty-type.controller';
import { StyTypeRepository } from './sty-type.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { STY_TYPE } from 'src/common/Entities/gpreport/table/STY_TYPE.entity';

@Module({
    imports: [TypeOrmModule.forFeature([STY_TYPE], 'gpreportConnection')],
    controllers: [StyTypeController],
    providers: [StyTypeService, StyTypeRepository],
    exports: [StyTypeService],
})
export class StyTypeModule {}
