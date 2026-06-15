import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'VORGMST',
    schema: 'WEBFORM',
})
export class VORGMST {
    @ViewColumn()
    VORGNO: string;

    @ViewColumn()
    VNAME: string;

    @ViewColumn()
    VDESC: string;

    @ViewColumn()
    CTYPE: string;
}
