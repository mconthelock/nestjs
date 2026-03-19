import { Module } from '@nestjs/common';
import { M001KpbmService } from './m001-kpbm.service';
import { M001KpbmController } from './m001-kpbm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { M001KPBM } from 'src/common/Entities/datacenter/table/M001KPBM.entity';
import { M001KpbmRepository } from './m001-kpbm.repository';

@Module({
    imports: [TypeOrmModule.forFeature([M001KPBM], 'datacenterConnection')],
    controllers: [M001KpbmController],
    providers: [M001KpbmService, M001KpbmRepository],
    exports: [M001KpbmService],
})
export class M001KpbmModule {}
