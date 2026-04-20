import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticTestController } from './static-test.controller';
import { StaticTestService } from './static-test.service';
import { SYS_FOLDER_PATH } from 'src/common/Entities/escs/table/SYS_FOLDER_PATH.entity';

/**
 * Static Test Module
 * @author  Mr.Pathanapong Sokpukeaw
 * @since   2026-04-20
 */
@Module({
    imports: [ TypeOrmModule.forFeature([SYS_FOLDER_PATH],'escsConnection') ],
    controllers: [ StaticTestController ],
    providers: [ StaticTestService ]
})
export class StaticTestModule {}