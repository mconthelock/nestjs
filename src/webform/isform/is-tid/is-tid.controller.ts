import {
    Controller,
    Get,
    Post,
    Body,
} from '@nestjs/common';
import { IsTidService } from './is-tid.service';
import { CreateIsTidFormDto } from './dto/create-is-tid.dto';
import { UpdateIsTidDto } from './dto/update-is-tid.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { IsTidCreateFormService } from './is-tid-createForm.service';

@Controller('isform/is-tid')
export class IsTidController {
    constructor(
        private readonly isTidService: IsTidService,
        private readonly IsTidCreateFormService: IsTidCreateFormService,
    ) {}

    @Post('getFormData')
    async getFormData(@Body() dto: FormDto) {
        return this.isTidService.findOne(dto);
    }
    @Get()
    findAll() {
        return this.isTidService.findAll();
    }

    @Post('search')
    @UseTransaction('webformConnection')
    async search(@Body() dto: FiltersDto) {
        return this.isTidService.search(dto);
    }

    @Post()
    @UseTransaction('webformConnection') // ใส่เพื่อบอกว่าเปิด transaction กับการเชื่อมต่อ webformConnection
    create(@Body() dto: CreateIsTidFormDto) {
        return this.IsTidCreateFormService.create(dto);
    }

    // @Patch(':id')
    // @UseInterceptors(getFileUploadInterceptor())
    // @UseTransaction('webformConnection')
    // update(@Param('id') id: string, @Body() dto: UpdateItemMfgDto) {
    //     return this.isTidService.update(+id, dto);
    // }
}
