import { IsOptional } from "class-validator";

export class SearchPpoDto {

    @IsOptional()
    SREFNO?: string;
}
