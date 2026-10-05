import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { J736kpService } from './j736kp.service';

@Controller('as400/j736kp')
export class J736kpController {
    constructor(private readonly j736kpService: J736kpService) {}

    @Get('search')
    async findByInvPuritm(
        @Query('inv') inv: string,
        @Query('puritm') puritm: string,
    ) {
        if (!inv || !puritm) {
            return {
                success: true,
                data: [], // ส่งเป็น Array ว่างกลับไป (หน้าบ้านจะได้เอาไปใช้งานต่อได้โดยไม่พัง)
            };
        }
        const result = await this.j736kpService.findByInvPuritm(inv, puritm);
        return {
            success: true,
            data: result,
        };
    }

    @Get()
    findAll() {
        return this.j736kpService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.j736kpService.findOne(+id);
    }

    @Patch(':formno')
    update(@Param('formno') formno: string) {
        return this.j736kpService.updateByFormno(formno);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.j736kpService.remove(+id);
    }
}
