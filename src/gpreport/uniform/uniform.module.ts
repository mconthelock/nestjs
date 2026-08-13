import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UniformService } from './uniform.service';
import { UniformController } from './uniform.controller';

import { UsersModule } from 'src/amec/users/users.module';

import { UNIFORM } from 'src/common/Entities/gpreport/table/UNIFORM.entity';
import { UNIFORM_CATEGORY } from 'src/common/Entities/gpreport/table/UNIFORM_CATEGORY.entity';
import { UNIFORM_RIGHT } from 'src/common/Entities/gpreport/table/UNIFORM_RIGHT.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [UNIFORM, UNIFORM_CATEGORY, UNIFORM_RIGHT],
            'gpreportConnection',
        ),
        UsersModule,
    ],
    controllers: [UniformController],
    providers: [UniformService],
})
export class UniformModule {}
