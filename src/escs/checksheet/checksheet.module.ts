import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecksheetController } from './checksheet.controller';
import { ChecksheetService } from './checksheet.service';
import { ChecksheetRepository } from './checksheet.repository';
import { GetOrderModule } from '../get-order/get-order.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([], 'escsConnection'),
        GetOrderModule
    ],
    controllers: [ChecksheetController],
    providers: [ChecksheetService, ChecksheetRepository],
})
export class ChecksheetModule {}