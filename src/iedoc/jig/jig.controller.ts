import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { JigService } from './jig.service';
import { CreateJigDto } from './dto/create-jig.dto';
import { UpdateJigDto } from './dto/update-jig.dto';
import { ReplaceCheckpointsDto } from './dto/checkpoint.dto';
import {
    CreateJigFormDto,
    JigFormKeyDto,
    SaveJigFormDto,
    JigFileDto,
} from './dto/jig-form.dto';
import { JigFormFileKeyDto } from './dto/jig-form.dto';
import { FinishInspectionDto } from './dto/finish-inspection.dto';
const formPath = 'forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO';

@Controller('iedoc/jig')
@UsePipes(
    new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }),
)
export class JigController {
    constructor(private readonly jigService: JigService) {}

    @Get('dashboard')
    getDashboard(@Query('fyear') fyear?: string) {
        return this.jigService.getDashboard(
            fyear === undefined ? undefined : Number(fyear),
        );
    }
    @Post()
    createJig(@Body() dto: CreateJigDto) {
        return this.jigService.createJig(dto);
    }

    @Get(formPath)
    getForm(@Param() key: JigFormKeyDto) {
        return this.jigService.getForm(key);
    }
    @Patch(formPath)
    saveForm(@Param() key: JigFormKeyDto, @Body() dto: SaveJigFormDto) {
        return this.jigService.saveForm(key, dto);
    }
    @Post(formPath + '/finish')
    finishForm(@Param() key: JigFormKeyDto, @Body() dto: FinishInspectionDto) {
        return this.jigService.finishForm(key, dto);
    }
    @Put(formPath + '/files')
    putFile(@Param() key: JigFormKeyDto, @Body() dto: JigFileDto) {
        return this.jigService.putFile(key, dto);
    }
    @Delete(formPath + '/files/:FILE_SEQ')
    deleteFile(@Param() key: JigFormFileKeyDto) {
        return this.jigService.deleteFile(key, key.FILE_SEQ);
    }

    @Get(':jigNo/checkpoints')
    getCheckpoints(@Param('jigNo') jigNo: string) {
        return this.jigService.getCheckpoints(jigNo);
    }
    @Put(':jigNo/checkpoints')
    replaceCheckpoints(
        @Param('jigNo') jigNo: string,
        @Body() dto: ReplaceCheckpointsDto,
    ) {
        return this.jigService.replaceCheckpoints(jigNo, dto);
    }
    @Get(':jigNo/forms')
    listForms(@Param('jigNo') jigNo: string) {
        return this.jigService.listForms(jigNo);
    }
    @Post(':jigNo/forms')
    createForm(@Param('jigNo') jigNo: string, @Body() dto: CreateJigFormDto) {
        return this.jigService.createForm(jigNo, dto);
    }
    @Get(':jigNo')
    getJig(@Param('jigNo') jigNo: string) {
        return this.jigService.getJig(jigNo);
    }
    @Patch(':jigNo')
    updateJig(@Param('jigNo') jigNo: string, @Body() dto: UpdateJigDto) {
        return this.jigService.updateJig(jigNo, dto);
    }
}
