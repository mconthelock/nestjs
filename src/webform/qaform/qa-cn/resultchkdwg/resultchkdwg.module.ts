import { Module } from '@nestjs/common';
import { ResultChkDwgService } from './resultchkdwg.service';
import { ResultChkDwgRepository } from './resultchkdwg.repository';
import { ResultchkdwgController } from './resultchkdwg.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RESULTCHKDWG } from 'src/common/Entities/webform/table/RESULTCHKDWG.entity';

@Module({
    imports: [TypeOrmModule.forFeature([RESULTCHKDWG], 'webformConnection')],
    controllers: [ResultchkdwgController],
    providers: [ResultChkDwgService, ResultChkDwgRepository],
    exports: [ResultChkDwgService, ResultChkDwgRepository],
})
export class ResultchkdwgModule {}
