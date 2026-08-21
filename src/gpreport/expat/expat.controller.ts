import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';

import { ExpatService } from './expat.service';
import { CreateExpatEmployeeDto } from './dto/create-expat-employee.dto';
import { UpdateExpatEmployeeDto } from './dto/update-expat-employee.dto';

@Controller('expat')
export class ExpatController {
    constructor(
        private readonly expatService: ExpatService,
    ) {}

    @Get('employees')
    findAllEmployees(
        @Query('company') company?: string,
    ) {
        return this.expatService.findAllEmployees(company);
    }

    @Get('employee/:sempno')
    findEmployee(
        @Param('sempno') sempno: string,
    ) {
        return this.expatService.findEmployee(sempno);
    }

    @Post('employee')
    createEmployee(
        @Body() dto: CreateExpatEmployeeDto,
    ) {
        return this.expatService.createEmployee(dto);
    }

    @Patch('employee/:sempno')
    updateEmployee(
        @Param('sempno') sempno: string,
        @Body() dto: UpdateExpatEmployeeDto,
    ) {
        return this.expatService.updateEmployee(
            sempno,
            dto,
        );
    }
}