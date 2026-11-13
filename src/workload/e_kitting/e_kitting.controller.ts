import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { EKittingService } from './e_kitting.service';
import { CreateEKittingDto } from './dto/create-e_kitting.dto';
import { UpdateEKittingDto } from './dto/update-e_kitting.dto';

@Controller('e-kitting')
export class EKittingController {
    constructor(private readonly eKittingService: EKittingService) {}

    @Post('search')
    search(@Body('order') order: string, @Body('packing') packing: string) {
        return this.eKittingService.search(order, packing);
    }
}
