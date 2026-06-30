import { ViewColumn, ViewEntity , PrimaryColumn } from 'typeorm';

@ViewEntity({
    name: 'FINPCK_VWSTATUS',
    schema: 'WEBFORM',
})
export class FINPCK_VWSTATUS {
    @ViewColumn()
    NFRMNO: number;

    @ViewColumn()
    VORGNO: string;

    @ViewColumn()
    CYEAR: string;

    @ViewColumn()
    CYEAR2: string;

    @ViewColumn()
    NRUNNO: number; 

    @ViewColumn()
    CCCODE: string; 

    @ViewColumn()
    CCDESC: string; 

    @ViewColumn()
    LOCCODE: string; 

    @ViewColumn()
    LOCNAME: string; 

    @ViewColumn()
    CST: string;  
    
    @ViewColumn()
    PICNOLOC: string; 

    @ViewColumn()
    PICNAMELOC: string; 

    @ViewColumn()
    PICNOWAIT: string; 

    @ViewColumn()
    PICNAMEWAIT: string; 
}

