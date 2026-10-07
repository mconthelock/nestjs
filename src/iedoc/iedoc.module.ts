import { Module } from '@nestjs/common';
import { JigModule } from './jig/jig.module';

@Module({
    imports: [JigModule],
})
export class IedocModule {}