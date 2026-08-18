import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TermcodeService } from './termcode.service';
import { TermcodeController } from './termcode.controller';

import { TERMCODE } from 'src/common/Entities/pursys/table/TERMCODE.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TERMCODE], 'purConnection')],
    controllers: [TermcodeController],
    providers: [TermcodeService],
})
export class TermcodeModule {}
