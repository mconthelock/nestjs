import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsOffService } from './is-off.service';
import { IsOffController } from './is-off.controller';

@Module({
    controllers: [IsOffController],
    providers: [IsOffService],
})
export class IsOffModule {}
