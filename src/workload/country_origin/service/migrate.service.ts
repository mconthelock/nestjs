import { Injectable } from '@nestjs/common';
import { colToNumber, readFile } from 'src/common/utils/exceljs';
import { CountryOriginService } from './country_origin.service';
import { CountryOriginRepository } from '../country_origin.repository';

@Injectable()
export class MigrateService extends CountryOriginService {
    constructor(protected readonly repo: CountryOriginRepository) {
        super(repo);
    }

    async migrateCountryOrigin() {
        try {
            // const workbook = new ExcelJS.Workbook();
            // await workbook.xlsx.readFile('../files/master.xlsx');
            // const sheet = workbook.getWorksheet('master');
            const data = await readFile({
                path: 'src/workload/country_origin/files/master.xlsx',
                headerName: [
                    { key: 'BULKCODE', header: 'BULK Code', column: 'C' },
                    { key: 'TRADING', header: 'Trading', column: 'H' },
                    { key: 'PROCESSING', header: 'Processing', column: 'I' },
                    {
                        key: 'MANUFACTURER',
                        header: 'Manufacturer',
                        column: 'J',
                    },
                    {
                        key: 'COUNTRY',
                        header: 'Country of Origin',
                        column: 'K',
                    },
                    {
                        key: 'MFG_NAME',
                        header: 'Manufacturer Name',
                        column: 'L',
                    },
                    {
                        key: 'MFG_ADDRESS',
                        header: 'Manufacturer Address',
                        column: 'M',
                    },
                ],
                startRow: 4,
                endRow: 4260,
                startCol: colToNumber('A'),
                endCol: colToNumber('M'),
            });
            const mapData = data
                .map((item) => {
                    let originType = 0;
                    if (item.TRADING) {
                        originType = 1;
                    } else if (item.PROCESSING) {
                        originType = 2;
                    } else if (item.MANUFACTURER) {
                        originType = 3;
                    }
                    let country = item.COUNTRY.toUpperCase().trim();
                    if (/,| OR |\/|・/.test(country)) {
                        country = country
                            .split(/,| OR |\/|・/)
                            .map((c) => c.trim())[0];
                        console.log('country', item.COUNTRY, country);
                    }
                    if (country === 'USA') {
                        country = 'UNITED STATES';
                    }
                    if (country === 'PHILIPINES') {
                        country = 'PHILIPPINES';
                    }
                    if (country === 'KOREA') {
                        country = 'SOUTH KOREA';
                    }
                    if (country === 'CZECH') {
                        country = 'CZECH REPUBLIC';
                    }
                    return {
                        ...item,
                        ORIGIN_TYPE: originType,
                        COUNTRY: country,
                    };
                })
                .filter(
                    (item) =>
                        item.ORIGIN_TYPE !== 0 &&
                        item.COUNTRY &&
                        item.COUNTRY !== 'STOP BUSINESS',
                );
            const country = mapData
                .map((item) => item.COUNTRY)
                .filter((item, index, self) => self.indexOf(item) === index);

            await this.repo.save(mapData);
            return {
                length: mapData.length,
                country: country.length,
                countryList: country,
                mapData,
                check: mapData.filter((item) => item.ORIGIN_TYPE === 0),
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
