import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MachineService } from './machine.service';
import { SearchMachineDto } from './dto/search-machine.dto';
import { MachineResponseDto } from './dto/machine-response.dto';   

@ApiTags('ESCS Machine')
@Controller('escs/machine')
export class MachineController {
    constructor(private readonly service: MachineService) {}

    @Get('search')
    @ApiOperation({ summary: 'Search for machines' })
    @ApiResponse({ status: 200, type: [MachineResponseDto] })
    search(@Query() dto: SearchMachineDto): Promise<MachineResponseDto> {
        return this.service.search(dto);
    }
}