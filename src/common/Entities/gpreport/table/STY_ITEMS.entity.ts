import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { STY_TYPE } from './STY_TYPE.entity';

@Entity({ name: 'STY_ITEMS', schema: 'GPREPORT' })
export class STY_ITEMS {
    @PrimaryGeneratedColumn()
    ITEMS_ID: number;

    @Column()
    ITEMS_TYPE: number;

    @Column()
    ITEMS_NAME: string;

    @Column()
    ITEMS_ENAME: string;

    @Column()
    ITEMS_USERCREATE: string;

    @Column()
    ITEMS_DATECREATE: Date;

    @Column()
    ITEMS_USERUPDATE: string;

    @Column()
    ITEMS_DATEUPDATE: Date;

    @ManyToOne(() => STY_TYPE)
    @JoinColumn({ name: 'ITEMS_TYPE', referencedColumnName: 'TYPE_ID' })
    STY_TYPE: STY_TYPE;
}
