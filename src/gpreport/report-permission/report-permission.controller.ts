import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { ReportPermissionService } from './report-permission.service';
import { CreateReportPermissionDto } from './dto/create-report-permission.dto';
import { UpdateReportPermissionDto } from './dto/update-report-permission.dto';

@Controller('gpreport/report-permission')
export class ReportPermissionController {
    constructor(
        private readonly reportPermissionService: ReportPermissionService,
    ) {}

    @Get()
    findAll() {
        return this.reportPermissionService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.reportPermissionService.findOne(id);
    }

    @Post()
    create(@Body() createReportPermissionDto: CreateReportPermissionDto) {
        return this.reportPermissionService.create(createReportPermissionDto);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateReportPermissionDto: UpdateReportPermissionDto,
    ) {
        return this.reportPermissionService.update(
            id,
            updateReportPermissionDto,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.reportPermissionService.remove(id);
    }
}
