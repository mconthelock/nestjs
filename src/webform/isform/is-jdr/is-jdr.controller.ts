import { Controller, Post, Body } from '@nestjs/common';
import { IsJdrService } from './is-jdr.service';
import { CreateIsJdrDto } from './dto/create-is-jdr.dto';
import { UpdateIsJdrDto } from './dto/update-is-jdr.dto';
import { SearchIsJdrDto } from './dto/search-is-jdr.dto';

@Controller('isform/is-jdr')
export class IsJdrController {
    constructor(private readonly srv: IsJdrService) {}

    @Post('create')
    create(@Body() createIsJdrDto: CreateIsJdrDto) {
        return this.srv.create(createIsJdrDto);
    }

    @Post('update')
    update(@Body() UpdateIsJdrDto: UpdateIsJdrDto) {
        return this.srv.update(UpdateIsJdrDto);
    }

    @Post('search')
    search(@Body() searchIsJdrDto: SearchIsJdrDto) {
        return this.srv.search(searchIsJdrDto);
    }
}
