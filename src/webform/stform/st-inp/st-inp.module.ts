import { Module } from '@nestjs/common';
import { StInpService } from './st-inp.service';
import { StInpController } from './st-inp.controller';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';

@Module({
    imports: [FormModule, FormmstModule],
    controllers: [StInpController],
    providers: [StInpService],
    exports: [StInpService],
})
export class StInpModule {}
