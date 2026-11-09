import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';
import { STY_CHEMICAL } from './STY_CHEMICAL.entity';

@Entity({ name: 'STY_CHEMICAL_SECTION', schema: 'GPREPORT' })
export class STY_CHEMICAL_SECTION {
    @PrimaryColumn()
    OWNER: string;

    @PrimaryColumn()
    OWNERCODE: string;

    @PrimaryColumn()
    AMEC_SDS_ID: number;

    @Column()
    RECEIVED_SDS_DATE: Date;

    @Column()
    USED_FOR: string;

    @Column()
    USED_AREA: string;

    @Column()
    KEEPING_POINT: string;

    @Column()
    QTY: number;

    @Column()
    REC4052: number;

    @Column()
    REC4054: number;

    @Column()
    STATUS: number;

    @Column()
    USER_CREATE: string;

    @Column()
    CREATE_DATE: Date;

    @Column()
    USER_UPDATE: string;

    @Column()
    UPDATE_DATE: Date;

    @ManyToOne(() => STY_CHEMICAL, (c) => c.SECTIONS)
    @JoinColumn({ name: 'AMEC_SDS_ID', referencedColumnName: 'AMEC_SDS_ID' })
    MASTER: STY_CHEMICAL;
}
