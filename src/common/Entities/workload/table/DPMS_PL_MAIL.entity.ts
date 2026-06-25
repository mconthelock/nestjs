import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'DPMS_PL_MAIL', schema: 'WORKLOAD' })
export class DPMS_PL_MAIL {
    @PrimaryGeneratedColumn()
    NID: number;

    @Column()
    VDISPLAY_NAME: string;

    @Column()
    VEMAIL_ADDRESS: string;
}
