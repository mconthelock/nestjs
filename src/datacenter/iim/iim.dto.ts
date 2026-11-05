import { Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class FindByProdDto {
    @IsNotEmpty()
    @Transform(({ value }) => Array.isArray(value) ? value.map(String) : String(value))
    IPROD: string | string[];
}