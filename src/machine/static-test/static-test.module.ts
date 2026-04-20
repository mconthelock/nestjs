import { Module } from '@nestjs/common';
import { StaticTestController } from './static-test.controller';
import { StaticTestService } from './static-test.service';

/**
 * Static Test Module
 * @author  Mr.Pathanapong Sokpukeaw
 * @since   2026-04-20
 */
@Module({
    controllers: [StaticTestController],
    providers: [StaticTestService],
})
export class StaticTestModule {}