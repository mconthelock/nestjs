import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { searchInqDto } from './dto/search.dto';
import { inqDataDto } from './dto/update-data.dto';
import { updateInqDto } from './dto/update-inquiry.dto';
import { AuthGuard } from '@nestjs/passport';
import { designProcessColumnMap } from './designprocess-column-map';
import { StatusService } from '../status/status.service';

type Row = Record<string, any>;

@Controller('sp/inquiry')
export class InquiryController {
    constructor(
        private readonly inq: InquiryService,
        private readonly statusService: StatusService,
    ) {}

    @Get('find/:id')
    findOne(@Param('id') id: number) {
        return this.inq.findOne(id);
    }

    @Post('search')
    async search(@Body() searchDto: any) {
        return await this.inq.search(searchDto);
    }

    @Post('create')
    async create(@Body() req: any) {
        const data = await this.inq.create(
            req.header,
            req.details,
            req.timelinedata || [],
            req.history || [],
        );
        return await this.inq.findByNumber(req.header.INQ_NO);
    }

    @Post('update')
    async update(@Body() req: any) {
        const data = await this.inq.update(
            req.header,
            req.details || [],
            req.deleteLine || [],
            req.deleteFile || [],
            req.timelinedata,
            req.history,
        );
        return await this.inq.findByNumber(req.header.INQ_NO);
    }

    @Post('revise')
    async revise(@Body() req: any) {
        return await this.inq.revise(req.id);
    }

    @Post('updateInquiry/:id')
    async updateInquiry(@Body() req: updateInqDto, @Param('id') id: number) {
        await this.inq.updateInquiry(req, id);
        return await this.inq.findByNumber(req.INQ_NO);
    }

    @Post('delete')
    async delete(@Body() searchDto: searchInqDto) {
        return await this.inq.delete(searchDto);
    }

    @Get('designprocess')
    @UseGuards(AuthGuard('jwt'))
    async designProcess() {
        //return this.inq.designProcess();
        const statusList = await this.statusService.findAll();
        const data = await this.inq.search({
            INQ_STATUS: '< 26',
            IS_DETAILS: '1',
            IS_TIMELINE: '1',
            IS_GROUP: '1',
        });
        // return data;

        const normalizeDetails = (raw: any): Row[] => {
            if (Array.isArray(raw)) return raw;
            if (raw) return [raw];
            return [];
        };

        const source = Array.isArray(data) ? data : [];
        let totalRows = 0;

        for (let i = 0; i < source.length; i++) {
            const details = normalizeDetails(source[i]?.details);
            totalRows += details.length;
        }

        const rows = new Array(totalRows);
        let cursor = 0;

        for (let i = 0; i < source.length; i++) {
            const inquiry = source[i];
            const details = normalizeDetails(inquiry?.details);
            if (details.length === 0) continue;

            const { details: _omitDetails, ...header } = inquiry;
            for (let j = 0; j < details.length; j++) {
                const detail = details[j];
                const result: Row = {};

                for (let k = 0; k < designProcessColumnMap.length; k++) {
                    const rule = designProcessColumnMap[k];
                    result[rule.out] = rule.get(
                        header,
                        detail,
                        inquiry?.timeline || {},
                        statusList,
                    );
                }

                rows[cursor++] = result;
            }
        }

        return rows;
    }
}
