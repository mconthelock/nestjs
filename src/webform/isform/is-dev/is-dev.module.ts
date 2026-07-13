import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsDevService } from './is-dev.service';
import { IsDevController } from './is-dev.controller';
import { ISDEV_DEVELOPER } from 'src/common/Entities/webform/table/ISDEV_DEVELOPER.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ISDEV_DEVELOPER], 'webformConnection')],
    controllers: [IsDevController],
    providers: [IsDevService],
})
export class IsDevModule {}
