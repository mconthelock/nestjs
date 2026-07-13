import { Module } from '@nestjs/common';
import { PsYicService } from './ps-yic.service';
import { PsYicController } from './ps-yic.controller';
import { PsYicRepository } from './ps-yic.repository';

@Module({
    controllers: [PsYicController],
    providers: [PsYicService, PsYicRepository],
})
export class PsYicModule {}
