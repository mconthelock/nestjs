import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TermcodeService } from './termcode.service';
import { TermcodeController } from './termcode.controller';

import { TermPayment } from 'src/common/Entities/pursys/table/TERM_PAYMENT.entity';
import { TermTrade } from 'src/common/Entities/pursys/table/TERM_TRADE.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([TermPayment, TermTrade], 'purConnection'),
    ],
    controllers: [TermcodeController],
    providers: [TermcodeService],
})
export class TermcodeModule {}
