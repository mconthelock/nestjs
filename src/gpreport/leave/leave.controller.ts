import { Controller, Get, Param } from '@nestjs/common';
import { LeaveService } from './leave.service';

import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';

@Controller('gpreport/leave')
export class LeaveController {
    constructor(private readonly leave: LeaveService) {}

    @Get('person/:id')
    findOne(@Param('id') id: string) {
        return this.leave.findByEmployee(id);
    }

    @Get('section/:id')
    findSection(@Param('id') id: string) {
        return this.leave.findBySection(id);
    }

    @Get('department/:id')
    findDepartment(@Param('id') id: string) {
        return this.leave.findByDepartment(id);
    }

    @Get('division/:id')
    findDivision(@Param('id') id: string) {
        return this.leave.findByDivision(id);
    }

    // @Get('actual/person/:id')
    // findActualPerson(@Param('id') id: string) {
    //     return this.leave.findActualById(id);
    // }
}
