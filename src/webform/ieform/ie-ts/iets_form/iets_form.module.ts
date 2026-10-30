import { Module } from '@nestjs/common';
import { IetsFormService } from './iets_form.service';
import { IetsFormController } from './iets_form.controller';
import { IetsFormRepository } from './iets_form.repository';
import { IetsListModule } from '../iets_list/iets_list.module';

@Module({
    imports: [IetsListModule],
    controllers: [IetsFormController],
    providers: [IetsFormService, IetsFormRepository],
    exports: [IetsFormRepository],
})
export class IetsFormModule {}
