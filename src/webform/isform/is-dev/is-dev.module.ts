import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsDevService } from './is-dev.service';
import { IsDevController } from './is-dev.controller';

@Module({
    controllers: [IsDevController],
    providers: [IsDevService],
})
export class IsDevModule {}
