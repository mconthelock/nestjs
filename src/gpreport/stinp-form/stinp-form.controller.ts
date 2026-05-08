import { Controller } from '@nestjs/common';
import { StinpFormService } from './stinp-form.service';

@Controller('stinp-form')
export class StinpFormController {
    constructor(private readonly stinpFormService: StinpFormService) {}
}
