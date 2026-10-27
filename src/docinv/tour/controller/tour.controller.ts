import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TourService } from '../services/tour.service';
import { TourMasterDto, TourUserDto, CreateTourUserDto } from '../dto/tour.dto';

@Controller('tour')
export class TourController {
    constructor(private readonly tourService: TourService) {}

    @Post('master')
    findOne(@Body() body: TourMasterDto) {
        return this.tourService.findOne('master', { key: body.KEY });
    }

    @Post('user')
    findUser(@Body() body: TourUserDto) {
        const { KEY, EMPNO } = body;
        return this.tourService.findOne('user', { key: KEY, empno: EMPNO });
    }

    @Post('user/create')
    createUser(@Body() data: CreateTourUserDto) {
        return this.tourService.createUser(data);
    }
}
