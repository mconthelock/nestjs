import { Controller } from '@nestjs/common';
import { OrgTreeService } from './org-tree.service';

@Controller('org-tree')
export class OrgTreeController {
    constructor(private readonly orgTreeService: OrgTreeService) {}
}
