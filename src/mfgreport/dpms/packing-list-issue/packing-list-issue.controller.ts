import {
    Controller,
    Post,
    Body,
} from '@nestjs/common';
import { PackingListIssueService } from './packing-list-issue.service';
import { CreatePackingListIssueDto } from './dto/create-packing-list-issue.dto';
import { UpdatePackingListIssueDto } from './dto/update-packing-list-issue.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';

@Controller('mfgreport/dpms/packing-list-issue')
export class PackingListIssueController {
    constructor(private readonly service: PackingListIssueService) {}

    @Post()
    @UseTransaction('workloadConnection')
    issue(@Body() dto: CreatePackingListIssueDto) {
        return this.service.issue(dto);
    }
}
