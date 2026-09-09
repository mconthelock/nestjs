import { IsString, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNewsDto {
    @IsString()
    NEWS_TITLE: string;

    @IsDate()
    @Type(() => Date)
    NEWS_START: Date;

    @IsDate()
    @Type(() => Date)
    NEWS_END: Date;

    @IsString()
    @IsOptional()
    NEWS_IMG?: string;

    @IsString()
    @IsOptional()
    NEWS_HEADER?: string;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    NEWS_ADDDATE?: Date;

    @IsString()
    @IsOptional()
    NEWS_ADDBY?: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    NEWS_UPDATEDATE?: Date;

    @IsString()
    @IsOptional()
    NEWS_UPDATEBY?: string;

    @IsString()
    NEWS_DETAIL: string;
}
