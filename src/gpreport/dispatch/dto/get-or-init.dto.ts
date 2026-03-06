import { IsString } from 'class-validator';
import { DispatchKeyDto } from './dispatch-key.dto';

export class GetOrInitDto extends DispatchKeyDto {
  @IsString()
  update_by: string;
}