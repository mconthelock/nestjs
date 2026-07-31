import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UniformService } from './uniform.service';
import { UniformController } from './uniform.controller';

import { UNIFORM } from '../../common/Entities/gpreport/table/UNIFORM.entity';
import { UNIFORM_CATEGORY } from '../../common/Entities/gpreport/table/UNIFORM_CATEGORY.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [UNIFORM, UNIFORM_CATEGORY],
            'gpreportConnection',
        ),
    ],
    controllers: [UniformController],
    providers: [UniformService],
})
export class UniformModule {}
