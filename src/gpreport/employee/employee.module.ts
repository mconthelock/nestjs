import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { EmployeeRepository } from './employee.repository';

import { MHMBNF00 } from 'src/common/Entities/gpreport/views/MHMBNF00.entity';
import { MHMEMJ00 } from 'src/common/Entities/gpreport/views/MHMEMJ00.entity';
import { MHMEMP00 } from 'src/common/Entities/gpreport/views/MHMEMP00.entity';
import { MHMPSN00 } from 'src/common/Entities/gpreport/views/MHMPSN00.entity';
import { MHMEML00 } from 'src/common/Entities/gpreport/views/MHMEML00.entity';
import { EMP01 } from 'src/common/Entities/gpreport/views/EMP01.entity';
import { HRMIR01P } from 'src/common/Entities/gpreport/views/HRMIR01P.entity';
import { MHMPRF00 } from 'src/common/Entities/gpreport/views/MHMPRF00.entity';
import { BENEFICIARY } from 'src/common/Entities/gpreport/table/BENEFICIARY.entity';
import { EmailLogs } from 'src/common/Entities/gpreport/table/EMPLOYEE_MAIL_LOG.entity';
import { User } from 'src/common/Entities/webform/views/AMECUSERALL.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                MHMBNF00,
                MHMEMJ00,
                MHMEMP00,
                MHMPSN00,
                EMP01,
                HRMIR01P,
                MHMPRF00,
                MHMEML00,
                BENEFICIARY,
                EmailLogs,
                User,
            ],
            'gpreportConnection',
        ),
    ],
    controllers: [EmployeeController],
    providers: [EmployeeService, EmployeeRepository],
})
export class EmployeeModule {}
