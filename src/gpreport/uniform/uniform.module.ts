import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'src/amec/users/users.module';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';

import { UniformService } from './uniform.service';
import { UniformController } from './uniform.controller';
import { AnnualUniformRepository } from './annual.repository';

import { UNIFORM } from 'src/common/Entities/gpreport/table/UNIFORM.entity';
import { UNIFORM_CATEGORY } from 'src/common/Entities/gpreport/table/UNIFORM_CATEGORY.entity';
import { UNIFORM_RIGHT } from 'src/common/Entities/gpreport/table/UNIFORM_RIGHT.entity';
import { AnnualUniform } from 'src/common/Entities/gpreport/table/UNIFORM_ANNUAL.entity';
import { AnnualUniformDetail } from 'src/common/Entities/gpreport/table/UNIFORM_ANNUAL_DETAIL.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                UNIFORM,
                UNIFORM_CATEGORY,
                UNIFORM_RIGHT,
                AnnualUniform,
                AnnualUniformDetail,
            ],
            'gpreportConnection',
        ),
        UsersModule,
        FormModule,
        FormmstModule,
    ],
    controllers: [UniformController],
    providers: [UniformService, AnnualUniformRepository],
})
export class UniformModule {}
