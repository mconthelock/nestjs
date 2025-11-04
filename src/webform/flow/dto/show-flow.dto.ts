import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { PickType } from '@nestjs/swagger';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class showFlowDto extends PickType(FormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
] as const) {
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsBoolean()
  showStep?: boolean = false;
}
