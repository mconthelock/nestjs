import { PartialType } from '@nestjs/swagger';
import { CreateProblemMasterDto } from './create-problem_master.dto';

// import { createInqDto } from './create-inquiry.dto';

export class SearchProblemOrdersDto extends PartialType(
    CreateProblemMasterDto,
) {}
