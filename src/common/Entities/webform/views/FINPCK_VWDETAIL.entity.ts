import { ViewColumn, ViewEntity , PrimaryColumn } from 'typeorm';

@ViewEntity({
    name: 'FINPCK_VWDETAIL',
    schema: 'WEBFORM',
})
export class FINPCK_VWDETAIL {
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
    ID: number;

    @ViewColumn()
    GRPCODE: string;

    @ViewColumn()
    ASSETNO: string;

    @ViewColumn()
    ASSETDESC: string;

    @ViewColumn()
    DOCDATE: Date;

    @ViewColumn()
    INITVAL: number;

    @ViewColumn()
    STARTDP: Date;
    
    @ViewColumn()
    MONTHDP: number;

    @ViewColumn()
    YTDDP: number;

    @ViewColumn()
    ACCUMDP: number;

    @ViewColumn()
    BOOKVAL: number;

    @ViewColumn()
    INVNO: string;

    @ViewColumn()
    MODELNO: string;

    @ViewColumn()
    SNNO: string;

    @ViewColumn()
    PONO: string;

    @ViewColumn()
    REFASSET: string;
   
    @ViewColumn()
    VOUCHER: string;

    @ViewColumn()
    QTY: number; 

    @ViewColumn()
    UNIT: string;

    @ViewColumn()
    STATUS: string;

    @ViewColumn()
    SUPPLIER: string; 

    @ViewColumn()
    PRNO: string; 

    @ViewColumn()
    BUDGETNO: string; 

    @ViewColumn()
    REQBY: string; 

    @ViewColumn()
    USINGLIFE: number; 

    @ViewColumn()
    CONFIRM: number; 

    @ViewColumn()
    NOSTICKER: number; 

    @ViewColumn()
    LOST: number;   

    @ViewColumn()
    DAMAGE: number; 
    
    @ViewColumn()
    MOVEMENT: number; 

    @ViewColumn()
    OTHCAUSE: number; 

    @ViewColumn()
    REMOTHCAUSE: string; 

    @ViewColumn()
    PIC: string; 

    @ViewColumn()
    GRPDESC: string; 

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
    DREQDATE: Date; 
}

