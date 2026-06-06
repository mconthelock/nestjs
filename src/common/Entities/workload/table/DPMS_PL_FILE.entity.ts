import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'DPMS_PL_FILE', schema: 'WORKLOAD' })
export class DPMS_PL_FILE {
    @PrimaryGeneratedColumn()
    NFILE_ID: number;

    @Column()
    VFILE_ONAME: string;

    @Column()
    VFILE_FNAME: string;

    @Column()
    VFILE_USERCREATE: string;

    @Column()
    DFILE_DATECREATE: Date;

    @Column()
    VFILE_USERUPDATE: string;

    @Column()
    DFILE_DATEUPDATE: Date;

    @Column()
    NFILE_TYPE: number;

    @Column()
    NFILE_STATUS: number;

    @Column()
    VFILE_PATH: string;
}
