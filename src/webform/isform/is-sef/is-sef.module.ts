import { Module } from '@nestjs/common';
import { IsSefService } from './is-sef.service';
import { IsSefController } from './is-sef.controller';
import { IsSefRepository } from './is-sef.repository';
import { FormmstModule } from 'src/webform/center/formmst/formmst.module';
import { FormModule } from 'src/webform/center/form/form.module';

@Module({
    imports: [FormmstModule, FormModule],
    controllers: [IsSefController],
    providers: [IsSefService, IsSefRepository],
})
export class IsSefModule {}
