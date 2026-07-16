import { Module } from '@nestjs/common';
import { ChecksheetController } from './checksheet.controller';
import { ChecksheetService } from './checksheet.service';
import { ChecksheetRepository } from './checksheet.repository';

@Module({
    controllers: [ChecksheetController],
    providers: [ChecksheetService, ChecksheetRepository],
})
export class ChecksheetModule {}