import { Injectable } from '@nestjs/common';
import { CreateStyPatrolInspectionDto } from './dto/create-sty-patrol-inspection.dto';
import { UpdateStyPatrolInspectionDto } from './dto/update-sty-patrol-inspection.dto';
import { StyPatrolInspectionRepository } from './sty-patrol-inspection.repository';
import { ReportStyPatrolInspectionDto } from './dto/report-sty-patrol-inspection.dto';
import { FormDto } from 'src/webform/center/form/dto/form.dto';

@Injectable()
export class StyPatrolInspectionService {
    constructor(private readonly repo: StyPatrolInspectionRepository) {}

    async listByMonthYear(month: string, year: string) {
        try {
            const [monthNum, yearNum] = [Number(month), Number(year)];
            const startDate = new Date(yearNum, monthNum - 1, 1);
            const endDate = new Date(yearNum, monthNum, 0); // วันสุดท้ายของเดือน
            const res = await this.repo.findBylength(startDate, endDate);
            if (res.length === 0) {
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
        } catch (error) {
            throw new Error(
                'Error fetching patrol inspections: ' + error.message,
            );
        }
    }

    async findDraft(empno: string) {
        try {
            const res = await this.repo.findDraft(empno);
            if (res.length === 0) {
                return {
                    status: false,
                    message: `No draft patrol inspections found for employee number ${empno}`,
                    data: null,
                };
            }
            return {
                status: true,
                message: `Draft patrol inspections found for employee number ${empno} (${res.length} record(s))`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                'Error fetching draft patrol inspection: ' + error.message,
            );
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

    async listByForm(dto: FormDto) {
        try {
            const res = await this.repo.listByForm(dto);
            if (res.length === 0) {
                return {
                    status: false,
                    message:
                        'No patrol inspections found for the provided form criteria',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Patrol inspections found for the provided form criteria (${res.length} record(s))`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to list patrol inspections by form: ${error.message}`,
            );
        }
    }

    async summaryClass(fyear: string, seccode?: string) {
        try {
            const res = await this.repo.summaryClass(fyear, seccode);
            const checked = res.some((item) => item.TOTAL >= 1);
            if (!checked) {
                return {
                    status: false,
                    message: `No patrol inspection summary classes found for fiscal year ${fyear}`,
                    data: [],
                };
            }
            return {
                status: true,
                message: `Patrol inspection summary classes found for fiscal year ${fyear} (${res.length} record(s))`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to get patrol inspection summary classes: ${error.message}`,
            );
        }
    }

    async summaryDepartment(fyear: string, month: number) {
        try {
            const res = await this.repo.summaryDepartment(fyear, month);
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: `No patrol inspection summary found for fiscal year ${fyear} and month ${month}`,
                    data: [],
                };
            }
            return {
                status: true,
                message: `Patrol inspection summary found for fiscal year ${fyear} and month ${month} (${length} record(s))`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to get patrol inspection summary by department: ${error.message}`,
            );
        }
    }

    async summaryItem(
        fyear: string,
        month: number,
        className: string,
        sseccode?: string,
    ) {
        try {
            const res = await this.repo.summaryItem(
                fyear,
                month,
                className.toUpperCase(),
                sseccode,
            );
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: `No patrol inspection summary found for fiscal year ${fyear}, month ${month}, and class ${className}`,
                    data: [],
                };
            }
            return {
                status: true,
                message: `Patrol inspection summary found for fiscal year ${fyear}, month ${month}, and class ${className} (${length} record(s))`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to get patrol inspection summary by item and class: ${error.message}`,
            );
        }
    }

    async summaryItemBySec(fyear: string, month: number, sseccode?: string) {
        try {
            const res = await this.repo.summaryItemBySec(
                fyear,
                month,
                sseccode,
            );
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: `No patrol inspection summary found for fiscal year ${fyear}, month ${month}, and section code ${sseccode}`,
                    data: [],
                };
            }
            return {
                status: true,
                message: `Patrol inspection summary found for fiscal year ${fyear}, month ${month}, and section code ${sseccode} (${length} record(s))`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to get patrol inspection summary by item and section: ${error.message}`,
            );
        }
    }

    async summarySection(fyear: string, month: number, deptcode: string) {
        try {
            const res = await this.repo.summarySection(fyear, month, deptcode);
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: `No patrol inspection summary found for fiscal year ${fyear}, month ${month}, and department code ${deptcode}`,
                    data: [],
                };
            }
            return {
                status: true,
                message: `Patrol inspection summary found for fiscal year ${fyear}, month ${month}, and department code ${deptcode} (${length} record(s))`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to get patrol inspection summary by section: ${error.message}`,
            );
        }
    }
}
