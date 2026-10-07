import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { SendLoanMailDto } from './dto/send-loan-mail.dto';
import { LoanService } from './loan.service';
import { SearchLoanDto } from './dto/search-loan.dto';

@Controller('gpreport/loan')
export class LoanController {
    constructor(private readonly loanService: LoanService) {}

    @Post('search')
    search(@Body() dto: SearchLoanDto) {
        return this.loanService.search(dto);
    }

    @Post('sendmail')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            limits: { fileSize: 20 * 1024 * 1024 },
        }),
    )
    send(
        @Body() dto: SendLoanMailDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) throw new BadRequestException('Zip file is required');
        const isZip =
            file.originalname.toLowerCase().endsWith('.zip') &&
            file.buffer.subarray(0, 2).toString() === 'PK';
        if (!isZip) throw new BadRequestException('Only zip file is allowed');
        return this.loanService.send(dto, file);
    }
}
