import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('webform/organizations')
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) {}
    @Post('search')
    @UseTransaction('webformConnection')
    async search(@Body() dto: FiltersDto) {
        return this.organizationsService.search(dto);
    }

    @Get()
    findAll() {
        return this.organizationsService.findAll();
    }

}
