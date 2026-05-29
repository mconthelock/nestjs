import { Type } from "class-transformer";
import { IsDate, IsNotEmpty,IsNumber,IsOptional,IsString } from "class-validator";
export class CreateGpGarDto {
    @IsNotEmpty()
    @IsString()
    @Type(()=> String)
    INBY : string;
    
    @IsNotEmpty()
    @IsString()
    @Type(()=> String)
    REQBY : string;

    @IsNotEmpty()
    @Type(()=> Date)
    @IsDate()
    REQDATE : Date;

    @IsNotEmpty()
    @IsNumber()
    @Type(()=> Number)
    CATEGORY_CODE : number;

    @IsOptional()
    @IsString()
    @Type(()=> String)
    REMARK? : string;

 //   @IsNotEmpty()
 //  @IsNumber()
 //   @Type(()=> Number)
 //    NFRMNO : number;

}
