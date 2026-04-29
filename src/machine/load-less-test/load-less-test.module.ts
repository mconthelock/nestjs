import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoadLessTestController } from './load-less-test.controller';
import { LoadLessTestService } from './load-less-test.service';
import { SYS_FOLDER_PATH } from 'src/common/Entities/escs/table/SYS_FOLDER_PATH.entity';

@Module({
    imports: [ TypeOrmModule.forFeature([SYS_FOLDER_PATH],'escsConnection') ],
    controllers: [ LoadLessTestController ],
    providers: [ LoadLessTestService ]
})
export class LoadLessTestModule {}