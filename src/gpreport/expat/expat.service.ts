import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { ExpatRepository } from './expat.repository';
import { CreateExpatEmployeeDto } from './dto/create-expat-employee.dto';
import { UpdateExpatEmployeeDto } from './dto/update-expat-employee.dto';
import { ExpatEmployee } from 'src/common/Entities/gpreport/table/expat_employee.entity';
import { CreateExpatFamilyDto } from './dto/create-expat-family.dto';
import { UpdateExpatFamilyDto } from './dto/update-expat-family.dto';
import { CreateExpatEmployeeFileDto } from './dto/create-expat-employee-file.dto';
import { CreateExpatFamilyFileDto } from './dto/create-expat-family-file.dto';

import { ExpatFamily } from 'src/common/Entities/gpreport/table/expat_family.entity';

@Injectable()
export class ExpatService {
    constructor(
        private readonly expatRepository: ExpatRepository,
    ) {}

    findAllEmployees(company?: string) {
        return this.expatRepository.findAllEmployees(company);
    }

    async findEmployee(sempno: string) {
        const employee =
            await this.expatRepository.findEmployeeDetail(sempno);

        if (!employee) {
            throw new NotFoundException('EXPAT_EMPLOYEE_NOT_FOUND');
        }

        return employee;
    }

    async createEmployee(dto: CreateExpatEmployeeDto) {
        const exists =
            await this.expatRepository.findOneEmployee(dto.SEMPNO);

        if (exists) {
            throw new ConflictException(
                'EXPAT_EMPLOYEE_ALREADY_EXISTS',
            );
        }

        const data = this.mapEmployeeData(dto);

        return this.expatRepository.createEmployee({
            SEMPNO: dto.SEMPNO,
            ...data,
        });
    }

    async updateEmployee(
        sempno: string,
        dto: UpdateExpatEmployeeDto,
    ) {
        const exists =
            await this.expatRepository.findOneEmployee(sempno);

        if (!exists) {
            throw new NotFoundException('EXPAT_EMPLOYEE_NOT_FOUND');
        }

        const data = this.mapEmployeeData(dto);

        // ไม่ให้ SEMPNO จาก body ไปเปลี่ยน Primary Key
        delete data.SEMPNO;

        return this.expatRepository.updateEmployee(
            sempno,
            data,
        );
    }

    private mapEmployeeData(
        dto: CreateExpatEmployeeDto | UpdateExpatEmployeeDto,
    ): Partial<ExpatEmployee> {
        const data: Partial<ExpatEmployee> = {};

        if (dto.SEMPNO !== undefined) {
            data.SEMPNO = dto.SEMPNO;
        }

        if (dto.PASSPORT_NO !== undefined) {
            data.PASSPORT_NO = dto.PASSPORT_NO;
        }

        if (dto.THAI_ADDR !== undefined) {
            data.THAI_ADDR = dto.THAI_ADDR;
        }

        if (dto.TELNO !== undefined) {
            data.TELNO = dto.TELNO;
        }

        if (dto.EMAIL !== undefined) {
            data.EMAIL = dto.EMAIL;
        }

        if (dto.START_WORK_DATE !== undefined) {
            data.START_WORK_DATE = dto.START_WORK_DATE ? new Date(dto.START_WORK_DATE) : null;
        }

        if (dto.SINGLE_WIN_DATE !== undefined) {
            data.SINGLE_WIN_DATE = dto.SINGLE_WIN_DATE ? new Date(dto.SINGLE_WIN_DATE) : null;
        }

        if (dto.VISA_APPT_DATE !== undefined) {
            data.VISA_APPT_DATE = dto.VISA_APPT_DATE ? new Date(dto.VISA_APPT_DATE) : null;
        }

        if (dto.VISA_EXP_DATE !== undefined) {
            data.VISA_EXP_DATE = dto.VISA_EXP_DATE ? new Date(dto.VISA_EXP_DATE) : null;
        }

        if (dto.LAST_ARRIVAL_DATE !== undefined) {
            data.LAST_ARRIVAL_DATE = dto.LAST_ARRIVAL_DATE ? new Date(dto.LAST_ARRIVAL_DATE) : null;
        }

        if (dto.LAST_ARRIVAL_UPD_DATE !== undefined) {
            data.LAST_ARRIVAL_UPD_DATE =dto.LAST_ARRIVAL_UPD_DATE ? new Date(dto.LAST_ARRIVAL_UPD_DATE) : null;
        }

        if (dto.LAST_90DAY_DATE !== undefined) {
            data.LAST_90DAY_DATE = dto.LAST_90DAY_DATE ? new Date(dto.LAST_90DAY_DATE) : null;
        }

        if (dto.LAST_90DAY_UPD_DATE !== undefined) {
            data.LAST_90DAY_UPD_DATE = dto.LAST_90DAY_UPD_DATE ? new Date(dto.LAST_90DAY_UPD_DATE) : null;
        }

        return data;
    }

    // =====================================================
    // FAMILY
    // =====================================================

    findFamily(sempno: string) {
        return this.expatRepository.findFamily(sempno);
    }

    async createFamily(
        sempno: string,
        dto: CreateExpatFamilyDto,
    ) {
        const employee =
            await this.expatRepository.findOneEmployee(sempno);

        if (!employee) {
            throw new NotFoundException(
                'EXPAT_EMPLOYEE_NOT_FOUND',
            );
        }

        const fid =
            await this.expatRepository.getNextFamilyId(sempno);

        const data = this.mapFamilyData(dto);

        return this.expatRepository.createFamily({
            SEMPNO: sempno,
            FID: fid,
            ...data,
        });
    }

    async updateFamily(
        sempno: string,
        fid: number,
        dto: UpdateExpatFamilyDto,
    ) {
        const family =
            await this.expatRepository.findOneFamily(
                sempno,
                fid,
            );

        if (!family) {
            throw new NotFoundException(
                'EXPAT_FAMILY_NOT_FOUND',
            );
        }

        return this.expatRepository.updateFamily(
            sempno,
            fid,
            this.mapFamilyData(dto),
        );
    }

    async deleteFamily(
        sempno: string,
        fid: number,
    ) {
        const family =
            await this.expatRepository.findOneFamily(
                sempno,
                fid,
            );

        if (!family) {
            throw new NotFoundException(
                'EXPAT_FAMILY_NOT_FOUND',
            );
        }

        return this.expatRepository.deleteFamily(
            sempno,
            fid,
        );
    }


    // =====================================================
    // EMPLOYEE FILE
    // =====================================================

    findEmployeeFiles(sempno: string) {
        return this.expatRepository.findEmployeeFiles(
            sempno,
        );
    }

    async createEmployeeFile(
        sempno: string,
        dto: CreateExpatEmployeeFileDto,
    ) {
        const employee =
            await this.expatRepository.findOneEmployee(sempno);

        if (!employee) {
            throw new NotFoundException(
                'EXPAT_EMPLOYEE_NOT_FOUND',
            );
        }

        const fileId =
            await this.expatRepository.getNextEmployeeFileId(
                sempno,
                dto.FILE_TYPE,
            );

        return this.expatRepository.createEmployeeFile({
            SEMPNO: sempno,
            FILE_ID: fileId,
            FILE_TYPE: dto.FILE_TYPE,
            FILE_NAME: dto.FILE_NAME,
            FILE_PATH: dto.FILE_PATH,
            FILE_DATE: new Date(),
        });
    }

    deleteEmployeeFile(
        sempno: string,
        fileType: string,
        fileId: number,
    ) {
        return this.expatRepository.deleteEmployeeFile(
            sempno,
            fileType,
            fileId,
        );
    }


    // =====================================================
    // FAMILY FILE
    // =====================================================

    findFamilyFiles(
        sempno: string,
        fid: number,
    ) {
        return this.expatRepository.findFamilyFiles(
            sempno,
            fid,
        );
    }

    async createFamilyFile(
        sempno: string,
        fid: number,
        dto: CreateExpatFamilyFileDto,
    ) {
        const family =
            await this.expatRepository.findOneFamily(
                sempno,
                fid,
            );

        if (!family) {
            throw new NotFoundException(
                'EXPAT_FAMILY_NOT_FOUND',
            );
        }

        const fileId =
            await this.expatRepository.getNextFamilyFileId(
                sempno,
                fid,
                dto.FILE_TYPE,
            );

        return this.expatRepository.createFamilyFile({
            SEMPNO: sempno,
            FID: fid,
            FILE_ID: fileId,
            FILE_TYPE: dto.FILE_TYPE,
            FILE_NAME: dto.FILE_NAME,
            FILE_PATH: dto.FILE_PATH,
            FILE_DATE: new Date(),
        });
    }

    deleteFamilyFile(
        sempno: string,
        fid: number,
        fileType: string,
        fileId: number,
    ) {
        return this.expatRepository.deleteFamilyFile(
            sempno,
            fid,
            fileType,
            fileId,
        );
    }


    // =====================================================
    // MAP FAMILY
    // =====================================================

    private mapFamilyData(
        dto: CreateExpatFamilyDto | UpdateExpatFamilyDto,
    ): Partial<ExpatFamily> {
        const data: Partial<ExpatFamily> = {};

        if (dto.RELATION !== undefined) {
            data.RELATION = dto.RELATION;
        }

        if (dto.FULL_NAME !== undefined) {
            data.FULL_NAME = dto.FULL_NAME;
        }

        if (dto.PASSPORT_NO !== undefined) {
            data.PASSPORT_NO = dto.PASSPORT_NO;
        }

        if (dto.SINGLE_WIN_DATE !== undefined) {
            data.SINGLE_WIN_DATE = dto.SINGLE_WIN_DATE
                ? new Date(dto.SINGLE_WIN_DATE)
                : null;
        }

        if (dto.VISA_APPT_DATE !== undefined) {
            data.VISA_APPT_DATE = dto.VISA_APPT_DATE
                ? new Date(dto.VISA_APPT_DATE)
                : null;
        }

        if (dto.VISA_EXP_DATE !== undefined) {
            data.VISA_EXP_DATE = dto.VISA_EXP_DATE ? new Date(dto.VISA_EXP_DATE) : null;
        }

        if (dto.LAST_ARRIVAL_DATE !== undefined) {
            data.LAST_ARRIVAL_DATE = dto.LAST_ARRIVAL_DATE ? new Date(dto.LAST_ARRIVAL_DATE) : null;
        }

        return data;
    }

    async findAmecEmployee(sempno: string) {
        const employee = await this.expatRepository.findAmecEmployee(sempno);
        if (!employee) {
            throw new NotFoundException('EMPLOYEE_NOT_FOUND',);
        }

        return employee;
    }
}