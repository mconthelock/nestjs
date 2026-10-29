import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'STY_CHEMICAL_REV', schema: 'GPREPORT' })
export class STY_CHEMICAL_REV {
    @Column()
    OWNER: string;

    @PrimaryColumn()
    OWNERCODE: string;

    @Column()
    REV: string;

    @Column()
    STATUS: number;

    @Column()
    TYPE: number;

    @Column()
    USER_CREATE: string;

    @Column()
    CREATE_DATE: Date;

    @Column()
    USER_UPDATE: string;

    @Column()
    UPDATE_DATE: Date;

    @Column()
    USER_APPROVE: string;

    @Column()
    APPROVE_DATE: Date;

    @Column()
    USER_CONTROL: string;
}
