import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { FireService } from './fire.service';
import { CreateFireItemDto } from './dto/create-fire-item.dto';
import { UpdateFireItemDto } from './dto/update-fire-item.dto';
import { SearchFireItemDto } from './dto/search-fire-item.dto';

@Controller('fire')
export class FireController {
    constructor(private readonly fireService: FireService) {}

    @Get('items')
    items() {
        return this.fireService.items();
    }

    @Post('save')
    @UseInterceptors(NoFilesInterceptor())
    saveItem(@Body() body: Record<string, unknown>) {
        return this.fireService.saveItem(body);
    }

    @Post('deactivate')
    @UseInterceptors(NoFilesInterceptor())
    deactivate(@Body() body: Record<string, unknown>) {
        return this.fireService.deactivate(body);
    }

    @Post('inspection/check')
    @UseInterceptors(FileInterceptor('excel', {limits: {fileSize: 10 * 1024 * 1024, files: 1}}))
    checkInspection(@Body('month') month: string, @UploadedFile() file: Express.Multer.File) {
        return this.fireService.checkInspection(month, file);
    }

    @Get()
    search(@Query() query: SearchFireItemDto) {
        return this.fireService.search(query);
    }

    @Get(':fireCode')
    findOne(@Param('fireCode') fireCode: string) {
        return this.fireService.findOne(fireCode);
    }

    @Post()
    create(@Body() dto: CreateFireItemDto) {
        return this.fireService.create(dto);
    }

    @Patch(':fireCode')
    update(@Param('fireCode') fireCode: string, @Body() dto: UpdateFireItemDto) {
        return this.fireService.update(fireCode, dto);
    }

    @Delete(':fireCode')
    remove(@Param('fireCode') fireCode: string) {
        return this.fireService.remove(fireCode);
    }
}
