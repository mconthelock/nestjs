import { IsString, IsNumber, IsOptional } from 'class-validator';
export class CreateAemployeeDto {
  @IsString()
  readonly sempno: string;
  sdivcode?: string;
  sdepcode?: string;
  sseccode?: string;
  sposcode?: string;
  sname?: string;
  ssurname?: string;
  stname?: string;
  stsurname?: string;
  slogin?: string;
  spassword?: string;
  cstatus?: string;
  crecmail?: string;
  srecmail?: string;
  startdate?: Date;
  clevel?: string;
  ntelno?: number;
  nismstatus?: number;
  dupdate?: Date;
  spassword1?: string;
  spassword2?: string;
  spassword3?: string;
  resigndate?: Date;
  jobtype?: string;
  creusrdate?: Date;
  updusrdate?: Date;
}
