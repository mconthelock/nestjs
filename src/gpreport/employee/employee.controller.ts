import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('gpreport/employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.employeeService.findOne(id);
    }
}
