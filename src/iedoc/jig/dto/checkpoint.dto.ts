import { Type } from 'class-transformer';
import {
    IsDefined,
    IsString,
    IsNotEmpty,
    MaxLength,
    IsInt,
    Min,
    Max,
    IsNumber,
    IsOptional,
    IsArray,
    ArrayMaxSize,
    ArrayUnique,
    ValidateNested,
} from 'class-validator';

export class CheckpointDto {
    @IsDefined()
    @IsInt()
    @Min(1)
    @Max(20)
    CHECK_SEQ: number;
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    CHECK_POINT: string;
    @IsOptional()
    @IsString()
    @MaxLength(100)
    INSPECTION_TOOL?: string;
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(-99999999.9999)
    @Max(99999999.9999)
    MIN?: number;
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(-99999999.9999)
    @Max(99999999.9999)
    MAX?: number;
    @IsOptional()
    @IsString()
    @MaxLength(20)
    UNIT?: string;
}

export class ReplaceCheckpointsDto {
    @IsDefined()
    @IsArray()
    @ArrayMaxSize(20)
    @ArrayUnique((item) => item.CHECK_SEQ)
    @ValidateNested({ each: true })
    @Type(() => CheckpointDto)
    CHECKPOINTS: CheckpointDto[];
    @IsOptional()
    @IsString()
    @MaxLength(10)
    UPDATE_BY?: string;
}
