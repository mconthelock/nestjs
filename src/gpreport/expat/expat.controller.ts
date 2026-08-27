import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    Res,
    UploadedFile,
    UseInterceptors,
    ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

import { ExpatService } from './expat.service';
import { CreateExpatEmployeeDto } from './dto/create-expat-employee.dto';
import { UpdateExpatEmployeeDto } from './dto/update-expat-employee.dto';
import { CreateExpatFamilyDto } from './dto/create-expat-family.dto';
import { UpdateExpatFamilyDto } from './dto/update-expat-family.dto';
import { CreateExpatEmployeeFileDto } from './dto/create-expat-employee-file.dto';
import { CreateExpatFamilyFileDto } from './dto/create-expat-family-file.dto';
import { CreateExpatTravelDto } from './dto/create-expat-travel.dto';
import { UpdateExpatTravelDto } from './dto/update-expat-travel.dto';


@Controller('expat')
export class ExpatController {
    constructor(private readonly expatService: ExpatService) {}

    @Get('employees')
    findAllEmployees(@Query('company') company?: string) {
        return this.expatService.findAllEmployees(company);
    }

    @Get('employee/:sempno')
    findEmployee(@Param('sempno') sempno: string) {
        return this.expatService.findEmployee(sempno);
    }

    @Post('employee')
    createEmployee(@Body() dto: CreateExpatEmployeeDto) {
        return this.expatService.createEmployee(dto);
    }

    @Patch('employee/:sempno')
    updateEmployee(@Param('sempno') sempno: string, @Body() dto: UpdateExpatEmployeeDto) {
        return this.expatService.updateEmployee(sempno, dto);
    }

    @Get('employee/:sempno/family')
    findFamily(@Param('sempno') sempno: string) {
        return this.expatService.findFamily(sempno);
    }

    @Post('employee/:sempno/family')
    createFamily(@Param('sempno') sempno: string, @Body() dto: CreateExpatFamilyDto) {
        return this.expatService.createFamily(sempno, dto);
    }

    @Patch('employee/:sempno/family/:fid')
    updateFamily(
        @Param('sempno') sempno: string,
        @Param('fid', ParseIntPipe) fid: number,
        @Body() dto: UpdateExpatFamilyDto,
    ) {
        return this.expatService.updateFamily(sempno, fid, dto);
    }

    @Delete('employee/:sempno/family/:fid')
    deleteFamily(@Param('sempno') sempno: string, @Param('fid', ParseIntPipe) fid: number) {
        return this.expatService.deleteFamily(sempno, fid);
    }

    @Get('employee/:sempno/files')
    findEmployeeFiles(@Param('sempno') sempno: string) {
        return this.expatService.findEmployeeFiles(sempno);
    }

    @Post('employee/:sempno/files')
    createEmployeeFile(@Param('sempno') sempno: string, @Body() dto: CreateExpatEmployeeFileDto) {
        return this.expatService.createEmployeeFile(sempno, dto);
    }

    @Delete('employee/:sempno/files/:fileType/:fileId')
    deleteEmployeeFile(
        @Param('sempno') sempno: string,
        @Param('fileType') fileType: string,
        @Param('fileId', ParseIntPipe) fileId: number,
    ) {
        return this.expatService.deleteEmployeeFile(sempno, fileType, fileId);
    }

    @Get('employee/:sempno/family/:fid/files')
    findFamilyFiles(
        @Param('sempno') sempno: string,
        @Param('fid', ParseIntPipe) fid: number,
    ) {
        return this.expatService.findFamilyFiles(sempno, fid);
    }

    @Post('employee/:sempno/family/:fid/files')
    createFamilyFile(
        @Param('sempno') sempno: string,
        @Param('fid', ParseIntPipe) fid: number,
        @Body() dto: CreateExpatFamilyFileDto,
    ) {
        return this.expatService.createFamilyFile(sempno, fid, dto);
    }

    @Delete('employee/:sempno/family/:fid/files/:fileType/:fileId')
    deleteFamilyFile(
        @Param('sempno') sempno: string,
        @Param('fid', ParseIntPipe) fid: number,
        @Param('fileType') fileType: string,
        @Param('fileId', ParseIntPipe) fileId: number,
    ) {
        return this.expatService.deleteFamilyFile(sempno, fid, fileType, fileId);
    }

    @Get('employee-master/:sempno')
    findAmecEmployee(@Param('sempno') sempno: string) {
        return this.expatService.findAmecEmployee(sempno);
    }

    @Post('uploadfile/:sempno/:fileType')
    @UseInterceptors(FileInterceptor('file'))
    uploadFileExpat(
        @Param('sempno') sempno: string,
        @Param('fileType') fileType: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.expatService.uploadFileExpat(sempno, fileType, file);
    }

    @Get('viewfile/:sempno/:fileType')
    viewFileExpat(
        @Param('sempno') sempno: string,
        @Param('fileType') fileType: string,
        @Query('download') download: string,
        @Res() res: Response,
    ) {
        return this.expatService.viewFileExpat(sempno, fileType, download === '1', res);
    }

    // TRAVEL
    @Get('employee/:sempno/travel')
    findEmployeeTravels(@Param('sempno') sempno: string) {
        return this.expatService.findEmployeeTravels(sempno);
    }

    @Post('employee/:sempno/travel')
    createEmployeeTravel(@Param('sempno') sempno: string, @Body() dto: CreateExpatTravelDto) {
        return this.expatService.createEmployeeTravel(sempno, dto);
    }

    @Get('employee/:sempno/family/:fid/travel')
    findFamilyTravels(@Param('sempno') sempno: string, @Param('fid', ParseIntPipe) fid: number) {
        return this.expatService.findFamilyTravels(sempno, fid);
    }

    @Post('employee/:sempno/family/:fid/travel')
    createFamilyTravel(
        @Param('sempno') sempno: string,
        @Param('fid', ParseIntPipe) fid: number,
        @Body() dto: CreateExpatTravelDto,
    ) {
        return this.expatService.createFamilyTravel(sempno, fid, dto);
    }

    @Patch('travel/:travelId')
    updateTravel(@Param('travelId', ParseIntPipe) travelId: number, @Body() dto: UpdateExpatTravelDto) {
        return this.expatService.updateTravel(travelId, dto);
    }

    @Delete('travel/:travelId')
    deleteTravel(@Param('travelId', ParseIntPipe) travelId: number) {
        return this.expatService.deleteTravel(travelId);
    }

    @Post('upload-family-file/:sempno/:fid')
    @UseInterceptors(FileInterceptor('file'))
    uploadFamilyFileExpat(
        @Param('sempno') sempno: string,
        @Param('fid', ParseIntPipe) fid: number,
        @Body('fileType') fileType: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.expatService.uploadFamilyFileExpat(
            sempno,
            fid,
            fileType,
            file,
        );
    }

    @Get('family-file/:sempno/:fid/:fileType')
    viewFamilyFileExpat(
        @Param('sempno') sempno: string,
        @Param('fid', ParseIntPipe) fid: number,
        @Param('fileType') fileType: string,
        @Query('download') download: string,
        @Res() res: Response,
    ) {
        return this.expatService.viewFamilyFileExpat(
            sempno,
            fid,
            fileType,
            download === '1',
            res,
        );
    }
}