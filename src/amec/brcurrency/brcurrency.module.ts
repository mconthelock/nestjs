import { Module } from '@nestjs/common';
import { BrcurrencyService } from './brcurrency.service';
import { BrcurrencyController } from './brcurrency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BRCURRENCY } from 'src/common/Entities/amec/table/BRCURRENCY.entity';
import { BrcurrencyRepository } from './brcurrency.repository';

@Module({
    imports: [TypeOrmModule.forFeature([BRCURRENCY], 'webformConnection')],
    controllers: [BrcurrencyController],
    providers: [BrcurrencyService, BrcurrencyRepository],
    exports: [BrcurrencyService],
})
export class BrcurrencyModule {}
