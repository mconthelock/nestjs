import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'CNITMINCHARGE', schema: 'WEBFORM' })
export class CNITMINCHARGE {
    @PrimaryColumn()
    ITEMNO: number;

    @Column()
    INCHARGE: string;
}
