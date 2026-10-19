import { Get } from '@nestjs/common';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { PilineProblemMstService } from './PILINE_PROBLEM_MST.service';
import { CreatePilineProblemMstDto } from './dto/CREATE-PILINE_PROBLEM_MST.dto';
import { UpdatePilineProblemMstDto } from './dto/UPDATE-PILINE_PROBLEM_MST.dto';
import { KeyPilineProblemMstDto } from './dto/KEY-PILINE_PROBLEM_MST.dto';

@Controller('workload/piline_problem_mst')
export class PilineProblemMstController {
    constructor(private readonly service: PilineProblemMstService) {}
    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Post()
    @UseTransaction('workloadConnection')
    create(@Body() dto: CreatePilineProblemMstDto) {
        return this.service.create(dto);
    }
    @Patch(':PROBLEM_ID')
    @UseTransaction('workloadConnection')
    update(
        @Param() key: KeyPilineProblemMstDto,
        @Body() dto: UpdatePilineProblemMstDto,
    ) {
        return this.service.update(key, dto);
    }
    @Delete(':PROBLEM_ID')
    @UseTransaction('workloadConnection')
    remove(@Param() key: KeyPilineProblemMstDto) {
        return this.service.remove(key);
    }
}
