import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { IsDate, IsOptional, ValidateNested } from 'class-validator';

import { CreateLeaveDto } from './create-leave.dto';
import { searchDto } from 'src/amec/users/dto/search-user.dto';

export class UsersDto extends PartialType(searchDto) {}

export class SearchLeaveDto extends PartialType(CreateLeaveDto) {
    @IsOptional()
    @ValidateNested()
    @Type(() => UsersDto)
    user?: UsersDto;

    @Type(() => Date)
    @IsOptional()
    @IsDate()
    START_FRMLVDATE?: Date;

    @Type(() => Date)
    @IsOptional()
    @IsDate()
    END_FRMLVDATE?: Date;
}
