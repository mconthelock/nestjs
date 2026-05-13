import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsNumber, isNumber, IsString, ValidateNested } from 'class-validator';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateFinDDto {

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  LINE_ID: number;

  @IsNotEmpty()
  @IsString()
  REASON: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  DUTY_VALUE: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  QTY: number;


}

// export class CreateFinDFormdto extends PickType(FormDto, [
 export class CreateFinDFormdto extends PickType(CreateFormDto, [

    'INPUTBY',
    'REQBY',
    'REMARK',
//   'NFRMNO',
//   'VORGNO',
//   'CYEAR',
//   'CYEAR2',
//   'NRUNNO',
]as const) {

    @IsNotEmpty()
    @IsString()
    @Type(()=> String)
    OPTION_CODE: string;

    @IsNotEmpty()
    @IsDate()
    @Type(()=> Date)
    EFFECTIVE_DATE: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(()=> Date)
    DATE_RECEIVE: Date;

    @IsNotEmpty()
    @IsString()
    @Type(()=> String)
    LOCATION: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(()=> CreateFinDDto)
    DATA: CreateFinDDto[];

    // @IsNotEmpty()
    // @IsNumber()
    // @Type(()=> Number)
    // NFRMNO: number;

    // @IsNotEmpty()
    // @IsNumber()
    // @Type(()=> String)
    // VORGNO: string;

    // @IsNotEmpty()
    // @IsNumber()
    // @Type(()=> String)
    // CYEAR: string;

    // @IsNotEmpty()
    // @IsNumber()
    // @Type(()=> String)
    // CYEAR2: string;

    // ---------


}