import { PartialType } from '@nestjs/mapped-types';
import { CreateQaFileDto } from './create-qa_file.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateQaFileDto extends PartialType(CreateQaFileDto) {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    FILE_ID: number;
}
