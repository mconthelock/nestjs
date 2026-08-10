import { Controller, Get } from '@nestjs/common';
import { BlockmasterService } from './blockmaster.service';
import { CreateBlockmasterDto } from './dto/create-blockmaster.dto';
import { UpdateBlockmasterDto } from './dto/update-blockmaster.dto';

@Controller('workload/blockmaster')
export class BlockmasterController {
    constructor(private readonly block: BlockmasterService) {}

    @Get()
    async findAll() {
        return this.block.findAll();
    }
}
