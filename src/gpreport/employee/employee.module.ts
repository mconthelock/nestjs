import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';

import { MHMBNF00 } from 'src/common/Entities/gpreport/table/MHMBNF00.entity';
import { MHMEMJ00 } from 'src/common/Entities/gpreport/table/MHMEMJ00.entity';
import { MHMEMP00 } from 'src/common/Entities/gpreport/table/MHMEMP00.entity';
import { MHMPSN00 } from 'src/common/Entities/gpreport/table/MHMPSN00.entity';
import { User } from 'src/common/Entities/webform/views/AMECUSERALL.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [MHMBNF00, MHMEMJ00, MHMEMP00, MHMPSN00, User],
            'gpreportConnection',
        ),
    ],
    controllers: [EmployeeController],
    providers: [EmployeeService],
})
export class EmployeeModule {}
