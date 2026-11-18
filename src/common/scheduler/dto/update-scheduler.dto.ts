import { PartialType } from '@nestjs/swagger';
import { CreateJobDto } from './create-scheduler.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Label } from 'src/common/helpers/label.decorator';

export class UpdateSchedulerDto extends PartialType(CreateJobDto) {
    @IsString()
    @IsNotEmpty()
    ID: string;

    @IsString()
    @IsOptional()
    UPDATE_BY: string;
}
