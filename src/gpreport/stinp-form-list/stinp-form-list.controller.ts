import { Controller } from '@nestjs/common';
import { StinpFormListService } from './stinp-form-list.service';

@Controller('stinp-form-list')
export class StinpFormListController {
    constructor(private readonly stinpFormListService: StinpFormListService) {}
}
