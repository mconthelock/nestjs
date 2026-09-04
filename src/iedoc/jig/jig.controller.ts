import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { JigService } from './jig.service';
import { CreateJigDto } from './dto/create-jig.dto';
import { FinishInspectionDto } from './dto/finish-inspection.dto';

@Controller('iedoc/jig')
export class JigController {
    constructor(
        private readonly jigService: JigService,
    ) {}

    @Get('dashboard')
    getDashboard(
        @Query('fyear') fyear?: string,
    ) {
        return this.jigService.getDashboard(
            fyear ? Number(fyear) : undefined,
        );
    }

    @Post()
    createJig(
        @Body() dto: CreateJigDto,
    ) {
        return this.jigService.createJig(dto);
    }

    @Patch('inspection/:inspecId/finish')
    finishInspection(
        @Param('inspecId', ParseIntPipe)
        inspecId: number,

        @Body()
        dto: FinishInspectionDto,
    ) {
        return this.jigService.finishInspection(
            inspecId,
            dto,
        );
    }
}