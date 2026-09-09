import { PartialType } from '@nestjs/mapped-types';
import { CreateNewsDto } from './create-news.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateNewsDto extends PartialType(CreateNewsDto) {
    @IsNotEmpty()
    NEWS_ID: number;

    @IsOptional()
    deletedFiles?: string[];
}
