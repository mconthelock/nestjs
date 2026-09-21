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
<<<<<<< HEAD
<<<<<<< HEAD
    exports: [ResultChkDwgService, ResultChkDwgRepository],
=======
    exports: [ResultChkDwgService],
>>>>>>> 67c79348 (PUR-EVA)
=======
    exports: [ResultChkDwgService, ResultChkDwgRepository],
>>>>>>> 093c063b (QA-CN)
})
export class ResultchkdwgModule {}
