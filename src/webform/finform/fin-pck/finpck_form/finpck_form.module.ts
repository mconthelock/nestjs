import { Module } from '@nestjs/common';
import { FinpckFormService } from './finpck_form.service';
import { FinpckFormController } from './finpck_form.controller';
import { FinpckFormRepository } from './finpck_form.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FINPCK_FORM } from 'src/common/Entities/webform/table/FINPCK_FORM.entity';
import { FINPCK_ASSET } from '../../../../common/Entities/webform/table/FINPCK_ASSET.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        FINPCK_FORM,
        FINPCK_ASSET,
    ], 'mitsuConnection'),
    ],
    controllers: [FinpckFormController],
    providers: [FinpckFormService, FinpckFormRepository],
    exports: [FinpckFormService, FinpckFormRepository],
})
export class FinpckFormModule {}
