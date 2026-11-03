import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusService } from './status.service';
import { Status } from './entities/status.entity';
import { StatusController } from './status.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Status], 'mitsuConnection')],
    controllers: [StatusController],
    providers: [StatusService],
    exports: [StatusService],
})
export class StatusModule {}
