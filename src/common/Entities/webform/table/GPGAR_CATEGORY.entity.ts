import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'GPGAR_CATEGORY', schema: 'WEBFORM' })
export class GPGAR_CATEGORY {
    @PrimaryColumn()
    CATEGORY_CODE: number;

    @Column()
    CATEGORY_NAME: string;

    @Column()
    ACTIVE: string;
}
