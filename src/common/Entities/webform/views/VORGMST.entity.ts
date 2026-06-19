import { ViewColumn, ViewEntity , PrimaryColumn } from 'typeorm';

@ViewEntity({
    name: 'VORGMST',
    schema: 'WEBFORM',
})
export class VORGMST {
    @PrimaryColumn()
    VORGNO: string;

    @ViewColumn()
    VNAME: string;

    @ViewColumn()
    VDESC: string;

    @ViewColumn()
    CTYPE: string;
}

