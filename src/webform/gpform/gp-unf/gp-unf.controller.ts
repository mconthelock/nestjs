import {
    Controller,
    Post,
    Body,
    Get,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { GpUnfService } from './gp-unf.service';
import { SearchGpUnfDto } from './dto/search-gp-unf.dto';

@Controller('gpform/gp-unf')
export class GpUnfController {
    constructor(private readonly gpUnfService: GpUnfService) {}

    @Post('search')
    search(@Body() searchGpUnfDto: SearchGpUnfDto) {
        return this.gpUnfService.search(searchGpUnfDto);
    }

    // @Get()
    // findAll() {
    //     return this.gpUnfService.findAll();
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.gpUnfService.findOne(+id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateGpUnfDto: UpdateGpUnfDto) {
    //     return this.gpUnfService.update(+id, updateGpUnfDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.gpUnfService.remove(+id);
    // }
}
