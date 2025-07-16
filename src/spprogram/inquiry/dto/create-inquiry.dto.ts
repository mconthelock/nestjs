import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateInquiryDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsString()
  INQ_NO: string;
  @IsString()
  @IsOptional()
  INQ_REV: string;

  @IsString()
  @IsOptional()
  INQ_STATUS: string;

  @IsString()
  @IsOptional()
  INQ_DATE: string;

  @IsString()
  @IsOptional()
  INQ_TRADER: string;

  @IsString()
  @IsOptional()
  INQ_AGENT: string;

  @IsString()
  @IsOptional()
  INQ_COUNTRY: string;

  @IsString()
  @IsOptional()
  INQ_TYPE: string;

  @IsString()
  @IsOptional()
  INQ_PRJNO: string;

  @IsString()
  @IsOptional()
  INQ_PRJNAME: string;

  @IsString()
  @IsOptional()
  INQ_SHOPORDER: string;

  @IsString()
  @IsOptional()
  INQ_SERIES: string;

  @IsString()
  @IsOptional()
  INQ_OPERATION: string;

  @IsString()
  @IsOptional()
  INQ_SPEC: string;

  @IsString()
  @IsOptional()
  INQ_PRDSCH: string;

  @IsString()
  @IsOptional()
  INQ_QUOTATION_TYPE: string;

  @IsString()
  @IsOptional()
  INQ_DELIVERY_TERM: string;

  @IsString()
  @IsOptional()
  INQ_DELIVERY_METHOD: string;

  @IsString()
  @IsOptional()
  INQ_SHIPMENT: string;

  @IsString()
  @IsOptional()
  INQ_MAR_PIC: string;

  @IsString()
  @IsOptional()
  INQ_FIN_PIC: string;

  @IsString()
  @IsOptional()
  INQ_PKC_PIC: string;

  @IsString()
  @IsOptional()
  INQ_MAR_SENT: string;

  @IsString()
  @IsOptional()
  INQ_MRE_RECV: string;

  @IsString()
  @IsOptional()
  INQ_MRE_FINISH: string;

  @IsString()
  @IsOptional()
  INQ_PKC_FINISH: string;

  @IsString()
  @IsOptional()
  INQ_BM_DATE: string;

  @IsString()
  @IsOptional()
  INQ_FIN_RECV: string;

  @IsString()
  @IsOptional()
  INQ_FIN_FINISH: string;

  @IsString()
  @IsOptional()
  INQ_FINISH: string;

  @IsString()
  @IsOptional()
  INQ_MAR_REMARK: string;

  @IsString()
  @IsOptional()
  INQ_DES_REMARK: string;

  @IsString()
  @IsOptional()
  INQ_FIN_REMARK: string;

  @IsString()
  @IsOptional()
  CREATE_AT: string;

  @IsString()
  @IsOptional()
  UPDATE_AT: string;

  @IsString()
  @IsOptional()
  CREATE_BY: string;

  @IsString()
  @IsOptional()
  UPDATE_BY: string;

  @IsString()
  @IsOptional()
  INQ_LATEST: string;

  @IsString()
  @IsOptional()
  TOTAL_FC: string;

  @IsString()
  @IsOptional()
  TOTAL_TC: string;

  @IsString()
  @IsOptional()
  GRAND_TOTAL: string;

  @IsString()
  @IsOptional()
  TOTAL_UNIT_PRICE: string;

  @IsString()
  @IsOptional()
  INQ_PKC_REQ: string;

  @IsString()
  @IsOptional()
  INQ_EXTEND: string;

  @IsString()
  @IsOptional()
  INQ_CUR: string;

  @IsString()
  @IsOptional()
  INQ_ACTUAL_PO: string;

  @IsString()
  @IsOptional()
  INQ_CUSTRQS: string;

  @IsString()
  @IsOptional()
  INQ_FIN_CHK: string;

  @IsString()
  @IsOptional()
  INQ_FIN_CONFIRM: string;

  @IsString()
  @IsOptional()
  INQ_FIN_CHECKED: string;

  @IsString()
  @IsOptional()
  INQ_COMPARE_DATE: string;

  @IsString()
  @IsOptional()
  INQ_CUSTOMER: string;

  @IsString()
  @IsOptional()
  INQ_CONTRACTOR: string;

  @IsString()
  @IsOptional()
  INQ_ENDUSER: string;

  @IsString()
  @IsOptional()
  INQ_PORT: string;

  @IsString()
  @IsOptional()
  INQ_USERPART: string;

  @IsString()
  @IsOptional()
  INQ_TCCUR: string;
}
