import { Transform } from 'class-transformer';
import { IsInt, Min, Max } from 'class-validator';

export class KeyPilineEventMstDto {
    @IsInt()
    @Min(Number.MIN_SAFE_INTEGER)
    @Max(Number.MAX_SAFE_INTEGER)
    @Transform(({ value }) =>
        typeof value === 'string' && /^-?\d+$/.test(value)
            ? Number(value)
            : value,
    )
    EVENT_ID: number;
}
