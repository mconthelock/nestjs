import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateTaskDto } from './create-task.dto';
import { IsString, IsOptional, ValidateNested } from 'class-validator';

export class TagsDto {
    @IsString()
    TAG_NAME: string;
}

export class SearchTaskDto extends PartialType(CreateTaskDto) {
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => TagsDto)
    tags?: TagsDto[];
}
