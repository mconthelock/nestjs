import { Injectable } from '@nestjs/common';
import { CreateGpLy01Dto } from './dto/create-gp-ly01.dto';
import { UpdateGpLy01Dto } from './dto/update-gp-ly01.dto';

@Injectable()
export class GpLy01Service {
    approve(createGpLy01Dto: CreateGpLy01Dto) {
        return 'This action adds a new gpLy01';
    }
}
