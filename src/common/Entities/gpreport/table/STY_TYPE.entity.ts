import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'STY_TYPE', schema: 'GPREPORT' })
export class STY_TYPE {
    @PrimaryGeneratedColumn()
    TYPE_ID: number;

    @Column()
    TYPE_MASTER: string;

    @Column()
    TYPE_CODE: string;

    @Column()
    TYPE_NO: number;

    @Column()
    TYPE_NAME: string;

    @Column()
    TYPE_DETAIL: string;

    @Column()
    TYPE_STATUS: number;
}
