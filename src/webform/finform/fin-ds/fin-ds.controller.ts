import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFiles,
    Req,
} from '@nestjs/common';
import { FinDsService } from './fin-ds.service';
import { CreateFinDDto, CreateFinDFormdto } from './dto/create-fin-d.dto';
import { UpdateFinDDto } from './dto/update-fin-d.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';

@Controller('finform/fin-ds')
export class FinDsController {
    constructor(private readonly finDsService: FinDsService) {}
    // constructor(private readonly finDsService: FinDsService) {}

    @Get()
    findAll() {
        return this.finDsService.findAll();
    }

    @Post()
    @UseTransaction('webformConnection')
    @UseInterceptors(getFileUploadInterceptor('attachfile', true, 20))
    create(
        @Body() dto: CreateFinDFormdto,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: Request,
    ) {
        // return this.finDsService.create(createFinDDto,files);
        const ip = getClientIP(req);
        return this.finDsService.create(dto, files, ip);
    }

    // @create()
    //  create2(
    //     @Body() dto: CreateFinDFormdto,
    //     @UploadedFiles() files: Express.Multer.File[]
    // ) {
    //     return this.finDsService.create(dto,files);
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.finDsService.findOne(+id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateFinDDto: UpdateFinDDto) {
    //   return this.finDsService.update(+id, updateFinDDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.finDsService.remove(+id);
    // }
}
