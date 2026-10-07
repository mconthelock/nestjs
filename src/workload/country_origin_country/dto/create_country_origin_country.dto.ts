import { PickType } from '@nestjs/swagger';
import { CreateCountryOriginDto } from 'src/workload/country_origin/dto/create_country_origin.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryOriginCountryDto extends PickType(
    CreateCountryOriginDto,
    ['BULKCODE'] as const,
) {
    @IsNotEmpty()
    @IsString()
    COUNTRY: string;
}
