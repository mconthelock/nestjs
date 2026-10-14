import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { BeneficiaryService } from './beneficiary.service';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { UpdateBeneficiaryDto } from './dto/update-beneficiary.dto';
import { UsersService } from 'src/amec/users/users.service';

@Controller('beneficiary')
export class BeneficiaryController {
    constructor(
        private readonly beneficiaryService: BeneficiaryService,
        private readonly usersService: UsersService,
    ) {}

    @Get('detail/:sempno')
    async getDetail(@Param('sempno') sempno: string) {
        const emp = await this.usersService.findEmp(sempno);
        return {
            user: emp,
            beneficiary: await this.beneficiaryService.getDetail(sempno),
        };
    }
}
