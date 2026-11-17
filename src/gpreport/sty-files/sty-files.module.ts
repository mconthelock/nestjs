import { Module } from '@nestjs/common';
import { StyFilesService } from './sty-files.service';
import { StyFilesController } from './sty-files.controller';
import { StyFilesRepository } from './sty-files.repository';
import { StyTypeModule } from '../sty-type/sty-type.module';

@Module({
    imports: [StyTypeModule],
    controllers: [StyFilesController],
    providers: [StyFilesService, StyFilesRepository],
})
export class StyFilesModule {}
