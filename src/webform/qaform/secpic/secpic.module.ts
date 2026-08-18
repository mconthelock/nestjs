import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SECPIC } from 'src/webform/qaform/secpic/entities/secpic.entity';

import { SecpicController } from './secpic.controller';
import { SecpicRepository } from './secpic.repository';
import { SecpicService } from './secpic.service';

@Module({
    imports: [TypeOrmModule.forFeature([SECPIC], 'webformConnection')],
    controllers: [SecpicController],
    providers: [SecpicService, SecpicRepository],
    exports: [SecpicService],
})
export class SecpicModule {}
