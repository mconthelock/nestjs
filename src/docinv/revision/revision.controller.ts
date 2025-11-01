import { Controller } from '@nestjs/common';
import { RevisionService } from './revision.service';

@Controller('revision')
export class RevisionController {
  constructor(private readonly revisionService: RevisionService) {}
}
