import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'EKITTING_CHECK_RESULT', schema: 'WORKLOAD' })
export class EKITTING_CHECK_RESULT {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    ORDERNO: string;

    @Column()
    PACKINGNO: string;

    @Column()
    DWG: string;

    @Column()
    RESULT: string;

    @Column()
    REMARK: string;

    @Column()
    CREATED_BY: string;

    @Column()
    CREATED_AT: Date;
}
