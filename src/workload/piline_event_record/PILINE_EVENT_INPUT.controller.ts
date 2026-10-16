import {
    BadRequestException,
    Body,
    Controller,
    Post,
    Get,
    Header,
    StreamableFile,
    Patch,
    Param,
    UploadedFiles,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
    PilineInputMultipartDto,
    SavePilineEventInputDto,
} from './dto/SAVE-PILINE_EVENT_INPUT.dto';
import {
    PilineEventInputService,
    PilineInputFiles,
} from './PILINE_EVENT_INPUT.service';

@Controller('workload/piline_event_record')
export class PilineEventInputController {
    constructor(private readonly inputService: PilineEventInputService) {}

    @Get('input/:number/files/:type/:seq')
    @Header('Cache-Control', 'private, no-store')
    @Header('X-Content-Type-Options', 'nosniff')
    async preview(@Param('number') number: string, @Param('type') type: string, @Param('seq') seq: string) {
        const file = await this.inputService.readAttachment(number,type,Number(seq));
        return new StreamableFile(file.buffer, { type: file.type, length: file.buffer.length,
            disposition: "inline; filename*=UTF-8''" + encodeURIComponent(file.name) });
    }

    @Post('input')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'eventFiles', maxCount: 10 },
                { name: 'ngFiles', maxCount: 10 },
            ],
            {
                storage: memoryStorage(),
                limits: {
                    files: 10,
                    fileSize: 5 * 1024 * 1024,
                    fields: 1,
                    fieldSize: 65536,
                },
            },
        ),
    )
    async save(
        @Body() body: PilineInputMultipartDto,
        @UploadedFiles() files: PilineInputFiles,
        editNumber?: string,
    ) {
        let payload: unknown;
        try {
            payload = JSON.parse(body.payload);
        } catch {
            throw new BadRequestException('payload must be valid JSON');
        }
        if (!payload || Array.isArray(payload) || typeof payload !== 'object')
            throw new BadRequestException('payload must be an object');
        const dto = await new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }).transform(payload, {
            type: 'body',
            metatype: SavePilineEventInputDto,
        });
        // This service owns the transaction, including commit and file cleanup. Do not add UseTransaction here.
        return this.inputService.save(dto, files || {}, editNumber);
    }
    @Patch('input/:number')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'eventFiles', maxCount: 10 },
                { name: 'ngFiles', maxCount: 10 },
            ],
            {
                storage: memoryStorage(),
                limits: {
                    files: 10,
                    fileSize: 5 * 1024 * 1024,
                    fields: 1,
                    fieldSize: 65536,
                },
            },
        ),
    )
    async edit(@Param('number') number: string, @Body() body: PilineInputMultipartDto, @UploadedFiles() files: PilineInputFiles) {
        return this.save(body, files, number);
    }

}
