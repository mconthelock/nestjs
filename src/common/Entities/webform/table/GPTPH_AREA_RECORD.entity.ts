import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
    name: 'GPTPH_AREA_RECORD',
    schema: 'WEBFORM',
})
export class GPTPH_AREA_RECORD {
    @PrimaryColumn()
    NFRMNO: number;
    @PrimaryColumn()
    CYEAR2: string;
    @Column()
    AREA_ID: number;
}