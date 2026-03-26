import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PisService } from './pis.service';
import { PisController } from './pis.controller';
import { PrintedService } from './printed/printed.service';
import { FileLoggerModule } from 'src/common/services/file-logger/file-logger.module';

@Module({
    imports: [
        FileLoggerModule,
        TypeOrmModule.forFeature([], 'workloadConnection'),
    ],
    controllers: [PisController],
    providers: [PisService, PrintedService],
})
export class PisModule {}
