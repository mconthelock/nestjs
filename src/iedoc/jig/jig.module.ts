import { Module } from '@nestjs/common';
import { JigController } from './jig.controller';
import { JigService } from './jig.service';
import { JigRepository } from './jig.repository';

@Module({
    controllers: [JigController],
    providers: [
        JigService,
        JigRepository,
    ],
    exports: [
        JigService,
    ],
})
export class JigModule {}
