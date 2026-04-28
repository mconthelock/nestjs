import { Module } from '@nestjs/common';
import { ChecksheetController } from './checksheet.controller';
import { ChecksheetService } from './checksheet.service';
import { ChecksheetRepository } from './checksheet.repository';

/**
 * Module for checksheet workflow (Excel Add-in integration).
 * @author Mr.Pathanapong Sokpukeaw
 * @since 2026-04-25
 */
@Module({
    controllers: [ChecksheetController],
    providers: [ChecksheetService, ChecksheetRepository]
})
export class ChecksheetModule {}