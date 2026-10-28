import { IsArray, IsInt, IsOptional, Min } from 'class-validator';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';

export class DoactionGpTphDto extends doactionFlowDto {
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @Min(1, { each: true })
    AREA_IDS?: number[];
}
