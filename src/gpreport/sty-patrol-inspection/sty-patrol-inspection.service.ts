import { Injectable } from '@nestjs/common';
import { CreateStyPatrolInspectionDto } from './dto/create-sty-patrol-inspection.dto';
import { UpdateStyPatrolInspectionDto } from './dto/update-sty-patrol-inspection.dto';
import { StyPatrolInspectionRepository } from './sty-patrol-inspection.repository';
import { ReportStyPatrolInspectionDto } from './dto/report-sty-patrol-inspection.dto';

@Injectable()
export class StyPatrolInspectionService {
    constructor(private readonly repo: StyPatrolInspectionRepository) {}

    async listByMonthYear(month: string, year: string) {
        try {
        const [monthNum, yearNum] = [Number(month), Number(year)];
        console.log('month', monthNum, 'year', yearNum);
        
        const startDate = new Date(yearNum, monthNum - 1, 1);
        const endDate = new Date(yearNum, monthNum, 0); // วันสุดท้ายของเดือน
        console.log('start', startDate, 'end', endDate);
        
        const res = await this.repo.findBylength(startDate, endDate);
        if(res.length === 0) {
            return {
                status: false,
                message: `No patrol inspections found for ${month}/${year}`,
                data: [],
            };
        }
        return {
            status: true,
            message: `Patrol inspections found for ${month}/${year} (${res.length} record(s))`,
            data: res,
        };
        }catch (error) {
            throw new Error('Error fetching patrol inspections: ' + error.message);
        }
    }

    async getItemReport(dto: ReportStyPatrolInspectionDto) {
        try {
            const res = await this.repo.getItemReport(dto);
            if (res.length === 0) {
                return {
                    status: false,
                    message: 'No data found for the provided report criteria',
                    data: null,
                };
            }
            return {
                status: true,
                message: 'Data retrieved successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to get item report: ${error.message}`);
        }   
    }
}
