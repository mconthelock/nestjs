import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'RETURN_APV_LIST', schema: 'ESCCHKSHT' })
export class RETURN_APV_LIST {
    @PrimaryGeneratedColumn()
    NID: number;

    @Column()
    VPROD: string;

    @Column()
    VORD_NO: string;

    @Column()
    VITEM: string;

    @Column()
    NDRAWINGID: number;

    @Column()
    VUSERCREATE: string;

    @Column()
    DDATECREATE: Date;

    @Column()
    VUSERUPDATE: string;

    @UpdateDateColumn()
    DDATEUPDATE: Date;

    @Column()
    NSECID: number;

    @Column()
    VSTATUSCODE: string;

    @Column()
    NSTATUS: number;
}
