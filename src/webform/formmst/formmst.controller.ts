import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FormmstService } from './formmst.service';
import { SearchFormmstDto } from './dto/searchFormmst.dto';
import { CreateFormmstDto } from './dto/create-formmst.dto';
import { UpdateFormmstDto } from './dto/update-formmst.dto';
import { CreateFormmstGroupDto } from './dto/create-formmst-group.dto';
import { UpdateFormmstGroupDto } from './dto/update-formmst-group.dto';

@ApiTags('Form master')
@Controller('formmst')
export class FormmstController {
    constructor(private readonly formmstService: FormmstService) {}

    @Get()
    @ApiOperation({
        summary: 'Get All Form master',
    })
    getFormMasterAll() {
        return this.formmstService.getFormMasterAll();
    }

    @Get(':vaname')
    @ApiOperation({
        summary: 'Get Form master by vaname',
    })
    @ApiParam({ name: 'vaname', example: 'IS-TID', required: true })
    getFormMasterByVaname(@Param('vaname') vaname: string) {
        return this.formmstService.getFormMasterByVaname(vaname);
    }

    @Post('getFormmst')
    @ApiOperation({
        summary: 'Get Form master',
    })
    async getFormmst(@Body() searchDto: SearchFormmstDto) {
        return await this.formmstService.getFormmst(searchDto);
    }

    @Post('create')
    async createFormMaster(@Body() data: CreateFormmstDto) {
        return await this.formmstService.createFormMaster(data);
    }

    @Post('update')
    async updateFormMaster(@Body() data: UpdateFormmstDto) {
        return await this.formmstService.updateFormMaster(data);
    }

    // Form Group section
    @Get('group/all')
    async getFormMasterGroup() {
        return await this.formmstService.getAllGroup();
    }

    @Post('group/create')
    async createFormMasterGroup(@Body() groupData: CreateFormmstGroupDto) {
        return await this.formmstService.createFormMasterGroup(groupData);
    }

    @Post('group/update')
    async updateFormMasterGroup(@Body() groupData: UpdateFormmstGroupDto) {
        return await this.formmstService.updateFormMasterGroup(groupData);
    }

    // Form Auth section
    @Get('auth/:NFRMNO/:VORGNO/:CYEAR')
    async getFormAuth(
        @Param('NFRMNO') NFRMNO: number,
        @Param('VORGNO') VORGNO: string,
        @Param('CYEAR') CYEAR: string,
    ) {
        return await this.formmstService.getFormAuth(NFRMNO, VORGNO, CYEAR);
    }

    @Get('auth/:EMPNO')
    async getFormAuthByEmpno(@Param('EMPNO') EMPNO: string) {
        return await this.formmstService.getFormAuthByEmpno(EMPNO);
    }

    @Post('auth/update')
    async upsertFormAuth(
        @Body()
        authData: {
            NFRMNO: number;
            VORGNO: string;
            CYEAR: string;
            VEMPNO: string;
            CAUTHNO: string;
        },
    ) {
        return await this.formmstService.upsertFormAuth(authData);
    }
}
