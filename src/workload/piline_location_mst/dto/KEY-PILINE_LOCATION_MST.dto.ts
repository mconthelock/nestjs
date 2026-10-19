import { Transform } from 'class-transformer';
import { IsInt, Min, Max } from 'class-validator';

export class KeyPilineLocationMstDto {
    @IsInt()
    @Min(Number.MIN_SAFE_INTEGER)
    @Max(Number.MAX_SAFE_INTEGER)
    @Transform(({ value }) =>
        typeof value === 'string' && /^-?\d+$/.test(value)
            ? Number(value)
            : value,
    )
    LOCATION_ID: number;
}
