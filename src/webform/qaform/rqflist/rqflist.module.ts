import { Module } from '@nestjs/common';
import { RqflistService } from './rqflist.service';
import { RqflistController } from './rqflist.controller';
import { RqflistRepository } from './rqflist.repository';
import { RQFLIST } from 'src/common/Entities/webform/table/RQFLIST.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([RQFLIST], 'webformConnection')],
    controllers: [RqflistController],
    providers: [RqflistService, RqflistRepository],
    exports: [RqflistService],
})
export class RqflistModule {}
