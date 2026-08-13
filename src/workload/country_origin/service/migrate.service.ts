import { Injectable } from '@nestjs/common';
import { colToNumber, readFile } from 'src/common/utils/exceljs';

@Injectable()
export class MigrateService {
    constructor() {}

    async migrateCountryOrigin() {
        try {
            // const workbook = new ExcelJS.Workbook();
            // await workbook.xlsx.readFile('../files/master.xlsx');
            // const sheet = workbook.getWorksheet('master');
            const data = await readFile({
                path: 'src/workload/country_origin/files/master.xlsx',
                headerName: [
                    { key: 'BULK_CODE', header: 'BULK Code', column: 'C' },
                    { key: 'TRADING', header: 'Trading', column: 'H' },
                    { key: 'PROCESSING', header: 'Processing', column: 'I' },
                    { key: 'MANUFACTURER', header: 'Manufacturer', column: 'J' },
                    { key: 'COUNTRY_OF_ORIGIN', header: 'Country of Origin', column: 'K' },
                    { key: 'MFG_NAME', header: 'Manufacturer Name', column: 'L' },
                    { key: 'MFG_ADDRESS', header: 'Manufacturer Address', column: 'M' },
                ],
                startRow: 4,
                endRow: 4260,
                startCol: colToNumber('A'),
                endCol: colToNumber('M'),
            });

            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
