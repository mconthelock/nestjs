import { Module } from '@nestjs/common';
import { PsFileModule } from './ps-file/ps-file.module';

@Module({
    imports: [PsFileModule],
})
export class PsFormModule {}
