import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'DPMS_PL_ISSUE_TYPE', schema: 'WORKLOAD' })
export class DPMS_PL_ISSUE_TYPE {
    @PrimaryGeneratedColumn()
    NID: number;

    @Column()
    VCODE: string;

    @Column()
    VDESCRIPTION: string;

    @Column()
    NSEQ: number;
}
