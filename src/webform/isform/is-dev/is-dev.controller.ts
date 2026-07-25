import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsDevService } from './is-dev.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer';

@ApiTags('IS-DEV')
@Controller('form/is/is-dev')
export class IsDevController {
    constructor(private readonly dev: IsDevService) {}

    @Post('assignment/add')
    async addDeveloper(@Body() dto: CreateDeveloperDto) {
        return this.dev.createDev(dto);
    }

    @Post('assignment/delete')
    async deleteDeveloper(@Body() dto: UpdateDeveloperDto) {
        return this.dev.deleteDev(dto);
    }

    //   @Get('/year/:year')
    //   @ApiOperation({
    //     summary: 'Get by Year',
    //     description:
    //       'Get all IS-DEV Form that request in specific Year, Data including Form/IS-DEV/Requestor (Exclude flow Data)',
    //   })
    //   findByYear(@Param('year') year: string) {
    //     return this.dev.findByYear(year);
    //   }

    //   @Get('/year/:year/id/:id')
    //   @ApiOperation({
    //     summary: 'Get by id',
    //     description:
    //       'Get all IS-DEV Form that request in specific Year, Data including Form/IS-DEV/Requestor (Exclude flow Data)',
    //   })
    //   findById(@Param('year') year: string, @Param('id') id: number) {
    //     return this.dev.findById(year, id);
    //   }

    //ISDEV_OBJECTIVE
    @Get('objective/all')
    @ApiOperation({
        summary: 'Get all Objective',
        description: 'Get all IS-DEV Objective',
    })
    findAllObjective() {
        return this.dev.findAllObjective();
    }

    //ISDEV_OBJECTIVE
    @Get('device/all')
    @ApiOperation({
        summary: 'Get all IS Device list',
        description: 'Get all IS-DEV Device list',
    })
    findAllDevice() {
        return this.dev.findAllDeviceMst();
    }

    //LABORCOST
    @Get('laborcost/all')
    findAllLaborcost() {
        return this.dev.findAllLaborcost();
    }
}
