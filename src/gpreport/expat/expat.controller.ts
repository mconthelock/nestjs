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
import {
    Delete,
    ParseIntPipe,
} from '@nestjs/common';

import { CreateExpatFamilyDto } from './dto/create-expat-family.dto';
import { UpdateExpatFamilyDto } from './dto/update-expat-family.dto';
import { CreateExpatEmployeeFileDto } from './dto/create-expat-employee-file.dto';
import { CreateExpatFamilyFileDto } from './dto/create-expat-family-file.dto';

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

    // =====================================================
    // FAMILY
    // =====================================================

    @Get('employee/:sempno/family')
    findFamily(
        @Param('sempno') sempno: string,
    ) {
        return this.expatService.findFamily(sempno);
    }

    @Post('employee/:sempno/family')
    createFamily(
        @Param('sempno') sempno: string,
        @Body() dto: CreateExpatFamilyDto,
    ) {
        return this.expatService.createFamily(
            sempno,
            dto,
        );
    }

    @Patch('employee/:sempno/family/:fid')
    updateFamily(
        @Param('sempno') sempno: string,
        @Param('fid', ParseIntPipe) fid: number,
        @Body() dto: UpdateExpatFamilyDto,
    ) {
        return this.expatService.updateFamily(
            sempno,
            fid,
            dto,
        );
    }

    @Delete('employee/:sempno/family/:fid')
    deleteFamily(
        @Param('sempno') sempno: string,
        @Param('fid', ParseIntPipe) fid: number,
    ) {
        return this.expatService.deleteFamily(
            sempno,
            fid,
        );
    }


    // =====================================================
    // EMPLOYEE FILE
    // =====================================================

    @Get('employee/:sempno/files')
    findEmployeeFiles(
        @Param('sempno') sempno: string,
    ) {
        return this.expatService.findEmployeeFiles(
            sempno,
        );
    }

    @Post('employee/:sempno/files')
    createEmployeeFile(
        @Param('sempno') sempno: string,
        @Body() dto: CreateExpatEmployeeFileDto,
    ) {
        return this.expatService.createEmployeeFile(
            sempno,
            dto,
        );
    }

    @Delete('employee/:sempno/files/:fileType/:fileId')
    deleteEmployeeFile(
        @Param('sempno') sempno: string,
        @Param('fileType') fileType: string,
        @Param('fileId', ParseIntPipe) fileId: number,
    ) {
        return this.expatService.deleteEmployeeFile(
            sempno,
            fileType,
            fileId,
        );
    }


    // =====================================================
    // FAMILY FILE
    // =====================================================

    @Get('employee/:sempno/family/:fid/files')
    findFamilyFiles(
        @Param('sempno') sempno: string,
        @Param('fid', ParseIntPipe) fid: number,
    ) {
        return this.expatService.findFamilyFiles(
            sempno,
            fid,
        );
    }

    @Post('employee/:sempno/family/:fid/files')
    createFamilyFile(
        @Param('sempno') sempno: string,
        @Param('fid', ParseIntPipe) fid: number,
        @Body() dto: CreateExpatFamilyFileDto,
    ) {
        return this.expatService.createFamilyFile(
            sempno,
            fid,
            dto,
        );
    }

    @Delete(
        'employee/:sempno/family/:fid/files/:fileType/:fileId',
    )
    deleteFamilyFile(
        @Param('sempno') sempno: string,
        @Param('fid', ParseIntPipe) fid: number,
        @Param('fileType') fileType: string,
        @Param('fileId', ParseIntPipe) fileId: number,
    ) {
        return this.expatService.deleteFamilyFile(
            sempno,
            fid,
            fileType,
            fileId,
        );
    }
}