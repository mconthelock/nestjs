import { Module } from '@nestjs/common';
import { EmptaxModule } from './emptax/emptax.module';
@Module({
    imports: [EmptaxModule],
})
export class DatalibiModule {}
