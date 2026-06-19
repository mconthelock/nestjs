import { PartialType } from '@nestjs/swagger';
import { CreateFxaLocmstDto } from './create-fxa_locmst.dto';

export class UpdateFxaLocmstDto extends PartialType(CreateFxaLocmstDto) {}
