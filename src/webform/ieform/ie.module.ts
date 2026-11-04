import { Module } from '@nestjs/common';
import { IeBgrModule } from './ie-bgr/ie-bgr.module';
import { IeFileModule } from './ie-file/ie-file.module';
import { IePtsModule } from './IE-PTS/ie-pts.module';
import { IeTsModule } from './ie-ts/ie-ts.module';

@Module({
    imports: [IeBgrModule, IeFileModule, IePtsModule, IeTsModule],
})
export class IEFormModule {}
