import { Injectable } from '@nestjs/common';
import { CountryOriginRepository } from '../country_origin.repository';
import { CreateCountryOriginDto } from '../dto/create_country_origin.dto';
import { CountryOriginCountryService } from 'src/workload/country_origin_country/country_origin_country.service';
import { CreateCountryOriginCountryDto } from 'src/workload/country_origin_country/dto/create_country_origin_country.dto';

@Injectable()
export class CountryOriginService {
    constructor(
        protected readonly repo: CountryOriginRepository,
        protected readonly countryService: CountryOriginCountryService,
    ) {}

    async create(dto: CreateCountryOriginDto | CreateCountryOriginDto[]) {
        try {
            await this.insertCountry(dto);
            const res = await this.repo.save(dto);
            if (!res) {
                return {
                    status: false,
                    message: 'Save Country Origin Error',
                };
            }
            return {
                status: true,
                message: 'Save Country Origin Success',
                data: res,
            };
        } catch (error) {
            throw new Error(`Save Country Origin Error: ${error.message}`);
        }
    }

    async insertCountry(
        dto: CreateCountryOriginDto | CreateCountryOriginDto[],
    ) {
        const country: CreateCountryOriginCountryDto[] = Array.isArray(dto)
            ? dto.flatMap((item) => {
                  if (Array.isArray(item.COUNTRY)) {
                      return item.COUNTRY.map((country) => ({
                          BULKCODE: item.BULKCODE,
                          COUNTRY: country,
                      }));
                  }
                  if (item.COUNTRY) {
                      return [
                          {
                              BULKCODE: item.BULKCODE,
                              COUNTRY: item.COUNTRY,
                          },
                      ];
                  }
                  return [];
              })
            : Array.isArray(dto.COUNTRY)
              ? dto.COUNTRY.map((country) => ({
                    BULKCODE: dto.BULKCODE,
                    COUNTRY: country,
                }))
              : [{ BULKCODE: dto.BULKCODE, COUNTRY: dto.COUNTRY }];
        return await this.countryService.create(country);
    }

    // async getCountry() {
    //     try {
    //         const res = await this.repo.getCountry();
    //         if (res.length > 0) {
    //             return {
    //                 status: true,
    //                 message: `Data found ${res.length} records`,
    //                 data: res,
    //             };
    //         }
    //         return {
    //             status: false,
    //             message: 'No data found',
    //         };
    //     } catch (error) {
    //         throw new Error(`Get Country Origin Error: ${error.message}`);
    //     }
    // }
}
