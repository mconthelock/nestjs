import { Module } from '@nestjs/common';
import { FormLinkService } from './form-link.service';
import { FormLinkRepository } from './form-link.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FORM_LINK } from 'src/common/Entities/webform/table/FROM_LINK.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        FORM_LINK,
    ], 'mitsuConnection'),
    ],
    providers: [FormLinkService, FormLinkRepository],
    exports: [FormLinkService],
})
export class FormLinkModule {}
