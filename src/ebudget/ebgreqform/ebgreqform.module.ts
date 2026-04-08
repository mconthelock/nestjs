import { Module } from '@nestjs/common';
import { EbgreqformService } from './ebgreqform.service';
import { EbgreqformController } from './ebgreqform.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EBGREQFORM } from 'src/common/Entities/ebudget/table/EBGREQFORM.entity';
import { EbgreqformRepository } from './ebgreqform.repository';

@Module({
    imports: [TypeOrmModule.forFeature([EBGREQFORM], 'ebudgetConnection')],
    controllers: [EbgreqformController],
    providers: [EbgreqformService, EbgreqformRepository],
    exports: [EbgreqformService],
})
export class EbgreqformModule {}
