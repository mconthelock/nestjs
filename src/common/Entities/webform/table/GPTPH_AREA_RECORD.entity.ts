import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { GPTPH_REQ_HEADER } from "./GPTPH_REQ_HEADER.entity";
import { GPTPH_AREAS } from "./GPTPH_AREAS.entity";

@Entity({
    name: 'GPTPH_AREA_RECORD',
    schema: 'WEBFORM',
})
export class GPTPH_AREA_RECORD {
    @PrimaryColumn()
    CYEAR2: string;
    @PrimaryColumn()
    NRUNNO: number;
    @PrimaryColumn()
    AREA_ID: number;

    @ManyToOne(() => GPTPH_REQ_HEADER)
    @JoinColumn([
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    form?: GPTPH_REQ_HEADER;

    @ManyToOne(() => GPTPH_AREAS)
    @JoinColumn([
        { name: 'AREA_ID', referencedColumnName: 'AREA_ID' },
    ])
    area?: GPTPH_AREAS;
}