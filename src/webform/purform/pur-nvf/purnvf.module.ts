import { Module } from '@nestjs/common';
import { PurnvfFormModule } from './purnvf_form/purnvf_form.module';

@Module({
    imports: [PurnvfFormModule],
})
export class PurNvfModule {}
