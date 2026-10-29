import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('webform/organizations')
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) {}
    @Post('search')
    @UseTransaction('webformConnection')
    async search(@Body() dto: FiltersDto) {
        return this.organizationsService.search(dto);
    }

    @Get()
    findAll() {
        return this.organizationsService.findAll();
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-29
     * @description ตรวจสอบว่าหน่วยงานที่ระบุมีอยู่ในระบบหรือไม่ และยังใช้งานอยู่หรือไม่
     * @param org รหัสหน่วยงานที่ต้องการตรวจสอบ
     * @returns true หากหน่วยงานมีอยู่และยังใช้งานอยู่, false หากไม่พบหรือไม่ใช้งาน
     */
    @Get('isActive/:org')
    isActive(@Param('org') org: string) {
        return this.organizationsService.checkOrganization(org);
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-29
     * @description ดึงรายการหน่วยงานย่อยของหน่วยงานที่ระบุ
     * @param org รหัสหน่วยงานที่ต้องการค้นหาหน่วยงานย่อย
     * @returns รายการหน่วยงานย่อยที่ตรงตามเงื่อนไข
     */
    @Get('sub/:org')
    getSubOrganizations(@Param('org') org: string) {
        return this.organizationsService.getSubOrganizations(org);
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-29
     * @description ดึงโครงสร้างหน่วยงานย่อยของหน่วยงานที่ระบุ รวมถึงหน่วยงานต้นทาง
     * @param org รหัสหน่วยงานที่ต้องการค้นหาโครงสร้างหน่วยงานย่อย
     * @returns รายการหน่วยงานย่อยที่ตรงตามเงื่อนไข รวมถึงหน่วยงานต้นทาง
     */
    @Get('orgTree/:org')
    getOrgTree(@Param('org') org: string) {
        return this.organizationsService.getSubOrganizations(org, true);
    }
}
