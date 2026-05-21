import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ISEVA_CRITERIA', schema: 'WEBFORM' })
export class ISEVA_CRITERIA {
    @PrimaryColumn()
    EVA_ID: number;

    @Column({ type: 'char', length: 1 })
    SECTION: string;

    @Column({ length: 255 })
    NAME_EN: string;

    @Column({ length: 255 })
    NAME_TH: string;

    @Column({ type: 'char', length: 1, default: '1' })
    ACTIVE: string;
}
