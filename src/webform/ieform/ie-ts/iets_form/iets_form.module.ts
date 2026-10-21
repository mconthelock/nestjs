import { Module } from '@nestjs/common';
import { IetsFormService } from './iets_form.service';
import { IetsFormController } from './iets_form.controller';
import { IetsFormRepository } from './iets_form.repository';

@Module({
    controllers: [IetsFormController],
    providers: [IetsFormService, IetsFormRepository],
})
export class IetsFormModule {}
