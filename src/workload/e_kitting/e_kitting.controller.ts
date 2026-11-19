import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete
} from '@nestjs/common';
import { EKittingService } from './e_kitting.service';
import { CreateEKittingDto } from './dto/create-e_kitting.dto';
import { UpdateEKittingDto } from './dto/update-e_kitting.dto';
import { DEFAULT_CIPHERS } from 'tls';

@Controller('e-kitting')
export class EKittingController {
    constructor(private readonly eKittingService: EKittingService) {}

    @Post('search')
    search(@Body('order') order: string, @Body('packing') packing: string) {
        return this.eKittingService.search(order, packing);
    }

    @Post('findQ141KP')
    findAll(@Body('order') order: string, @Body('item') item: string) {
        return this.eKittingService.findQ141KP(order, item);
    }

    @Get(['getMaster', 'getMaster/:item'])
    master(@Param('item') item?: string) {
        return this.eKittingService.getMaster(item);
    }

    @Post('saveMaster')
    saveMaster(@Body() body: CreateEKittingDto) {
        return this.eKittingService.saveMaster(body);
    }

    @Delete('deleteMaster')
    deleteMaster(@Body('item') item: string,@Body('DWG') DWG: string) {
        return this.eKittingService.deleteMaster(item, DWG);
    }
}
