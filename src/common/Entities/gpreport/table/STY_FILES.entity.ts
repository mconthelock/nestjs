import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'STY_FILES', schema: 'GPREPORT' })
export class STY_FILES {
    @PrimaryGeneratedColumn()
    FILE_ID: number;

    @Column()
    FILE_ONAME: string;

    @Column()
    FILE_FNAME: string;

    @Column()
    TYPE_ID: number;

    @Column()
    FILE_USERCREATE: string;

    @Column()
    FILE_DATECREATE?: Date;

    @Column()
    FILE_USERUPDATE?: string;

    @UpdateDateColumn()
    FILE_DATEUPDATE?: Date;

    @Column()
    FILE_PATH: string;

    @Column()
    STATUS?: number;
}
