import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
} from '@nestjs/common';
import { MfgDrawingService } from './mfg-drawing.service';
import {
    CreateMfgDrawingCheckSheetDto,
    CreateMfgDrawingDto,
} from './dto/create-mfg-drawing.dto';
import { UpdateMfgDrawingDto } from './dto/update-mfg-drawing.dto';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { MfgDrawingCreateChecksheetService } from './mfg-drawing-checksheet.service';

@Controller('escs/mfg-drawing')
export class MfgDrawingController {
    constructor(
        private readonly mfgDrawingService: MfgDrawingService,
        private readonly mfgDrawingCheckSheetService: MfgDrawingCreateChecksheetService,
    ) {}

    @Post()
    @UseInterceptors(getFileUploadInterceptor())
    @UseTransaction('escsConnection') // ใส่เพื่อบอกว่าเปิด transaction กับการเชื่อมต่อ escsConnection
    create(@Body() dto: CreateMfgDrawingCheckSheetDto): Promise<any> {
        return this.mfgDrawingCheckSheetService.create(dto);
    }

    @Get()
    findAll() {
        return this.mfgDrawingService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.mfgDrawingService.findOne(+id);
    }

    @Post('search')
    @UseTransaction('escsConnection')
    async search(@Body() dto: FiltersDto) {
        return this.mfgDrawingService.search(dto);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateMfgDrawingDto: UpdateMfgDrawingDto,
    ) {
        return this.mfgDrawingService.update(+id, updateMfgDrawingDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.mfgDrawingService.remove(+id);
    }
}
