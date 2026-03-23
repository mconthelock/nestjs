import { Module } from '@nestjs/common';
import { M12023ItemarrnglstAppService } from './m12023_itemarrnglst_app.service';
import { M12023ItemarrnglstAppController } from './m12023_itemarrnglst_app.controller';
import { M12023ItemarrnglstAppRepository } from './m12023_itemarrnglst_app.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { M12023_ITEMARRNGLST_APP } from 'src/common/Entities/elmes/table/M12023_ITEMARRNGLST_APP.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([M12023_ITEMARRNGLST_APP], 'elmesConnection'),
    ],
    controllers: [M12023ItemarrnglstAppController],
    providers: [M12023ItemarrnglstAppService, M12023ItemarrnglstAppRepository],
    exports: [M12023ItemarrnglstAppService],
})
export class M12023ItemarrnglstAppModule {}
