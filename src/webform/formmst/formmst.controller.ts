import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FormmstService } from './formmst.service';
import { SearchFormmstDto } from './dto/searchFormmst.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

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

    @Post('create/formmst')
    async createFormMaster(@Body() groupData: any) {
        return await this.formmstService.createFormMasterGroup(groupData);
    }

    @Post('update/formmst/:NNO/:VORGNO/:CYEAR')
    async updateFormMaster(
        @Param('NNO') NNO: number,
        @Param('VORGNO') VORGNO: string,
        @Param('CYEAR') CYEAR: string,
        @Body() groupData: any,
    ) {
        return await this.formmstService.updateFormMaster(
            NNO,
            VORGNO,
            CYEAR,
            groupData,
        );
    }

    // Form Group section
    @Get('group/master')
    async getFormMasterGroup() {
        return await this.formmstService.getAllGroup();
    }

    @Post('create/group')
    async createFormMasterGroup(@Body() groupData: any) {
        return await this.formmstService.createFormMasterGroup(groupData);
    }
}
