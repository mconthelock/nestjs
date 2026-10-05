import { IsOptional, IsString, MaxLength, Matches, IsArray, ArrayMaxSize, ArrayUnique, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IntersectionType } from '@nestjs/mapped-types';
import { JigFormKeyDto, JigFileDto } from './jig-form.dto';

export class JigDeleteContentDto {
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    REASON?: string;
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    DETAIL?: string;
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(5)
    @ArrayUnique((file: JigFileDto) => file.FILE_SEQ)
    @ValidateNested({ each: true })
    @Type(() => JigFileDto)
    FILES?: JigFileDto[];
}

export class CreateJigDeleteFormDto extends IntersectionType(JigFormKeyDto, JigDeleteContentDto) {
    @IsString()
    @Matches(/\S/)
    @MaxLength(20)
    JIG_NO: string;
}

export class SaveJigDeleteFormDto extends JigDeleteContentDto {
    @IsString()
    @Matches(/^[A-Za-z0-9]{1,10}$/)
    UPDATE_BY: string;
}
