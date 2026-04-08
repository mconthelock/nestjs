import { Module } from '@nestjs/common';
import { EbgreqattfileService } from './ebgreqattfile.service';
import { EbgreqattfileController } from './ebgreqattfile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EBGREQATTFILE } from 'src/common/Entities/ebudget/table/EBGREQATTFILE.entity';
import { EbgreqattfileRepository } from './ebgreqattfile.repository';

@Module({
    imports: [TypeOrmModule.forFeature([EBGREQATTFILE], 'ebudgetConnection')],
    controllers: [EbgreqattfileController],
    providers: [EbgreqattfileService, EbgreqattfileRepository],
    exports: [EbgreqattfileService],
})
export class EbgreqattfileModule {}
