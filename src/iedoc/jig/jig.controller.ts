import {
    Body,
    StreamableFile,
    Header,
    Req,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { JigService } from './jig.service';
import { CreateJigDeleteFormDto, SaveJigDeleteFormDto } from './dto/jig-delete-form.dto';
import { CreateJigRequestDto } from './dto/create-jig-request.dto';
import { UpdateJigDto } from './dto/update-jig.dto';
import { ReplaceCheckpointsDto } from './dto/checkpoint.dto';
import {
    CreateJigFormDto,
    JigFormKeyDto,
    SaveJigFormDto,
    JigFileDto,
    ConfigureJigFlowDto,
} from './dto/jig-form.dto';
import { JigFormFileKeyDto } from './dto/jig-form.dto';
import { FinishInspectionDto } from './dto/finish-inspection.dto';
import { AutoInspectionDto } from './dto/auto-inspection.dto';
import { Request } from 'express';
import { getClientIP } from 'src/common/utils/ip.utils';
import { JigNgTagService } from './jig-ng-tag.service';
const formPath = 'forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO';
const deleteFormPath = 'delete-forms/:NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO';

@Controller('iedoc/jig')
@UsePipes(
    new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }),
)
export class JigController {
    constructor(private readonly jigService: JigService, private readonly ngTag: JigNgTagService) {}

    @Get('mfg-processes')
    getMfgProcesses() {
        return this.jigService.getMfgProcesses();
    }

    @Post('delete-forms')
    createDeleteForm(@Body() dto: CreateJigDeleteFormDto) { return this.jigService.createDeleteForm(dto); }

    @Get(deleteFormPath)
    getDeleteForm(@Param() key: JigFormKeyDto) { return this.jigService.getDeleteForm(key); }

    @Patch(deleteFormPath)
    saveDeleteForm(@Param() key: JigFormKeyDto, @Body() dto: SaveJigDeleteFormDto) {
        return this.jigService.saveDeleteForm(key, dto);
    }

    @Delete(deleteFormPath + '/files/:FILE_SEQ')
    deleteDeleteFormFile(@Param() key: JigFormFileKeyDto) {
        return this.jigService.deleteDeleteFormFile(key, key.FILE_SEQ);
    }

    @Post(deleteFormPath + '/finish')
    finishDeleteForm(@Param() key: JigFormKeyDto) { return this.jigService.finishDeleteForm(key); }

    @Post(deleteFormPath + '/reject')
    rejectDeleteForm(@Param() key: JigFormKeyDto) { return this.jigService.rejectDeleteForm(key); }

    @Get('locations')
    getLocations() {
        return this.jigService.getLocations();
    }

    @Get('ie-pics')
    getIePics() {
        return this.jigService.getIePics();
    }

    @Get('dashboard')
    getDashboard() {
        return this.jigService.getDashboard();
    }

    @Post()
    createJig(@Body() dto: CreateJigRequestDto) {
        return this.jigService.createJig(dto);
    }

    @Post('auto-inspection')
    autoInspection(@Body() dto: AutoInspectionDto, @Req() req: Request) {
        return this.jigService.autoCreateInspection(dto.date, getClientIP(req));
    }

    @Get(formPath)
    getForm(@Param() key: JigFormKeyDto) {
        return this.jigService.getForm(key);
    }
    @Get(formPath + '/ng-tag.pdf')
    @Header('Cache-Control', 'no-store')
    async ngTagPdf(@Param() key: JigFormKeyDto) {
        const pdf = await this.ngTag.generate(key);
        return new StreamableFile(pdf, { type: 'application/pdf',
            disposition: `inline; filename="NG-TAG-${key.NFRMNO}-${key.VORGNO.replace(/[^a-zA-Z0-9_-]/g, '_')}-${key.CYEAR}-${key.CYEAR2}-${key.NRUNNO}.pdf"` });
    }
    @Patch(formPath)
    saveForm(@Param() key: JigFormKeyDto, @Body() dto: SaveJigFormDto) {
        return this.jigService.saveForm(key, dto);
    }
    @Post(formPath + '/finish')
    finishForm(@Param() key: JigFormKeyDto, @Body() dto: FinishInspectionDto) {
        return this.jigService.finishForm(key, dto);
    }
    @Post(formPath + '/requester-flow')
    configureRequesterFlow(@Param() key: JigFormKeyDto, @Body() dto: ConfigureJigFlowDto) {
        return this.jigService.configureRequesterFlow(key, dto.PICCODE);
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
    @Get(':jigNo/defect-ng')
    getDefectNg(@Param('jigNo') jigNo: string) {
        return this.jigService.getDefectNg(jigNo);
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
