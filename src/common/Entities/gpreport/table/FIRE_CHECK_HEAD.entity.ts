import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity({ name: 'FIRE_CHECK_HEAD', schema: 'GPREPORT' })
@Unique('UK_FIRE_CHECK_AREA_MONTH', ['AREA', 'FMONTH', 'FYEAR'])
export class FireCheckHead {
    @PrimaryColumn({ precision: 3, scale: 0 })
    NFRMNO: number;

    @PrimaryColumn({ length: 6 })
    VORGNO: string;

    @PrimaryColumn({ type: 'char', length: 2 })
    CYEAR: string;

    @PrimaryColumn({ type: 'char', length: 4 })
    CYEAR2: string;

    @PrimaryColumn({ precision: 6, scale: 0 })
    NRUNNO: number;

    @Column({ length: 100 })
    AREA: string;

    @Column({ length: 2 })
    FMONTH: string;

    @Column({ length: 4 })
    FYEAR: string;
}
