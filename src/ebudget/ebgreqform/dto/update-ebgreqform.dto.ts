import { PartialType } from '@nestjs/swagger';
import { CreateEbgreqformDto } from './create-ebgreqform.dto';

export class UpdateEbgreqformDto extends PartialType(CreateEbgreqformDto) {}
