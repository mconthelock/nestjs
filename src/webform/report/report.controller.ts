import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { CreateReportAuthDto } from './dto/create-auth.dto';

@Controller('webform/report')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Post('/master')
    create(@Body() createReportDto: CreateReportDto) {
        return this.reportService.create(createReportDto);
    }

    @Get('/master')
    findAll() {
        return this.reportService.findAll();
    }

    @Get('/master/:id')
    findOne(@Param('id') id: string) {
        return this.reportService.findOne(+id);
    }

    @Patch('/master/:id')
    update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
        return this.reportService.update(+id, updateReportDto);
    }

    @Delete('/master/:id')
    remove(@Param('id') id: string) {
        return this.reportService.remove(+id);
    }

    //Auth
    @Get('/auth/:id')
    findAuth(@Param('id') id: string) {
        return this.reportService.findAuth(+id);
    }

    @Get('/auth/user/:id')
    findAuthUser(@Param('id') id: string) {
        return this.reportService.findAuthUser(id);
    }

    @Patch('/auth')
    updateAuth(@Body() updateReportDto: CreateReportAuthDto) {
        return this.reportService.updateAuth(updateReportDto);
    }
}
