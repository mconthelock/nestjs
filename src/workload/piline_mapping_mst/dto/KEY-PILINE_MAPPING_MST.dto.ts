import { Transform } from 'class-transformer';
import { IsInt, Min, Max } from 'class-validator';

export class KeyPilineMappingMstDto {
    @IsInt()
    @Min(Number.MIN_SAFE_INTEGER)
    @Max(Number.MAX_SAFE_INTEGER)
    @Transform(({ value }) =>
        typeof value === 'string' && /^-?\d+$/.test(value)
            ? Number(value)
            : value,
    )
    MAP_ID: number;
}
