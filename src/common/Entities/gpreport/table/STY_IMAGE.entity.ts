import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'STY_IMAGE', schema: 'GPREPORT' })
export class STY_IMAGE {
    @PrimaryGeneratedColumn()
    IMAGE_ID: number;

    @Column()
    IMAGE_ONAME: string;

    @Column()
    IMAGE_FNAME: string;

    @Column()
    TYPE_ID: number;

    @Column()
    IMAGE_USERCREATE: string;

    @Column()
    IMAGE_DATECREATE: Date;

    @Column()
    IMAGE_USERUPDATE: string;

    @UpdateDateColumn()
    IMAGE_DATEUPDATE: Date;

    @Column()
    IMAGE_PATH: string;
}
