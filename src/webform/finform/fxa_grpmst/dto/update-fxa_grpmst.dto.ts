import { PartialType } from '@nestjs/swagger';
import { CreateFxaGrpmstDto } from './create-fxa_grpmst.dto';

export class UpdateFxaGrpmstDto extends PartialType(CreateFxaGrpmstDto) {}
