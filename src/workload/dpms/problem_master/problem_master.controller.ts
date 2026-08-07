import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { ProblemMasterService } from './problem_master.service';

import { CreateProblemMasterDto } from './dto/create-problem_master.dto';
import { UpdateProblemMasterDto } from './dto/update-problem_master.dto';
import { SearchProblemMasterDto } from './dto/search-problem_master.dto';

@Controller('workload/problem-master')
export class ProblemMasterController {
    constructor(private readonly problemMasterService: ProblemMasterService) {}

    @Post('search')
    search(@Body() dto: SearchProblemMasterDto) {
        return this.problemMasterService.search(dto);
    }
}
