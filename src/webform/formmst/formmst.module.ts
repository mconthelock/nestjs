import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormmstService } from './formmst.service';
import { FormmstController } from './formmst.controller';
import { FormmstRepository } from './formmst.repository';
import { UsersModule } from 'src/amec/users/users.module';

import { FORMMST } from 'src/common/Entities/webform/table/FORMMST.entity';
import { FORMMST_GROUP } from 'src/common/Entities/webform/table/FORMMST_GROUP.entity';
import { USRAUTH } from 'src/common/Entities/webform/table/USRAUTH.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [FORMMST, FORMMST_GROUP, USRAUTH],
            'webformConnection',
        ),
        UsersModule,
    ],
    controllers: [FormmstController],
    providers: [FormmstService, FormmstRepository],
    exports: [FormmstService],
})
export class FormmstModule {}
