import { Controller, Get, Query } from '@nestjs/common';
import { PurnvfLocationService } from './purnvf_location.service';

@Controller('purform/purnvf-location')
export class PurnvfLocationController {
  constructor(private readonly purnvfLocationService: PurnvfLocationService) {}

  @Get('countries') // GET: /address/countries
  async getCountries() {
    return this.purnvfLocationService.getCountries();
  }

@Get('provinces') // GET: /address/provinces
  async getProvinces() {
    return this.purnvfLocationService.getProvinces();
  }

  @Get('districts') // GET: /address/districts (ส่งหรือไม่ส่ง ?provinceId=xx ก็ได้)
  async getDistricts(@Query('provinceId') provinceId?: number) {
    return this.purnvfLocationService.getDistricts(provinceId);
  }

  @Get('sub-districts') // GET: /address/sub-districts (ส่งหรือไม่ส่ง ?districtId=xx ก็ได้)
  async getSubDistricts(@Query('districtId') districtId?: number) {
    return this.purnvfLocationService.getSubDistricts(districtId);
  }
}
