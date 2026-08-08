import { PartialType } from '@nestjs/swagger';
import { CreateProblemMasterDto } from './create-problem_master.dto';

export class UpdateProblemMasterDto extends PartialType(CreateProblemMasterDto) {}
