import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { updateInqDto } from './update-inquiry.dto';
import { updateTimelineDto } from '../../timeline/dto/update-dto';
import { createHistoryDto } from '../../history/dto/create.dto';

export class inqDataDto {
  @ValidateNested()
  @Type(() => updateInqDto)
  header?: updateInqDto;

  @IsOptional()
  details?: any[];

  @IsOptional()
  deleteLine?: any[];

  @IsOptional()
  deleteFile?: any[];

  @IsOptional()
  timelinedata?: updateTimelineDto;

  @IsOptional()
  history?: createHistoryDto;
}
