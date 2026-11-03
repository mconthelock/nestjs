import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'EXPAT_FAMILY_FILE', schema: 'GPREPORT' })
export class ExpatFamilyFile {

    @PrimaryColumn()
    SEMPNO: string;

    @PrimaryColumn()
    FILE_ID: number;

    @PrimaryColumn()
    FID: number;

    @PrimaryColumn()
    FILE_TYPE: string;

    @Column()
    FILE_NAME: string;

    @Column()
    FILE_PATH: string;

    @Column()
    FILE_DATE: Date;

}