import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'ORGANIZATIONS',
    schema: 'WEBFORM',
})
export class ORGANIZATIONS {
    @ViewColumn()
    SDIVCODE: string;

    @ViewColumn()
    SDIVISION: string;

    @ViewColumn()
    SDIV: string;

    @ViewColumn()
    SDEPCODE: string;

    @ViewColumn()
    SDEPARTMENT: string;

    @ViewColumn()
    SDEPT: string;

    @ViewColumn()
    SSECCODE: string;

    @ViewColumn()
    SSECTION: string;

    @ViewColumn()
    SSEC: string;

    @ViewColumn()
    CSTATUS: string;
}
