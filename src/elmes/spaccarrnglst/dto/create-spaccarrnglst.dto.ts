import { IsString } from 'class-validator';

export class CreateSpaccarrnglstDto {
  @IsString()
  ORDERNO: string;

  @IsString()
  MELCALACLS: string;

  @IsString()
  ITEMNO: string;

  @IsString()
  SERIALNO: string;

  @IsString()
  BMCLS: string;

  @IsString()
  APNAMERMRK: string;

  @IsString()
  PARTNO: string;

  @IsString()
  TOTALQTY: string;

  @IsString()
  SCNDPRTCLS: string;

  @IsString()
  SUPPLYCLS: string;

  @IsString()
  REVSUBNO: string;
}
