import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'INV_CHECK_ASSIGN', schema: 'SKIDCNTRL' })
export class INV_CHECK_ASSIGN {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    CHECK_PERIOD: string;

    @Column()
    GROUP_CODE: string;

    @Column({ default: 'PENDING' })
    STATUS: string;

    @Column()
    CREATED_BY: string;

    @Column({ type: 'date', default: () => 'SYSDATE' })
    CREATED_AT: Date;

    @Column({ type: 'date', default: () => 'SYSDATE' })
    UPDATED_AT: Date;

    @Column({ nullable: true })
    LEADER1_ID: string;

    @Column({ nullable: true })
    LEADER2_ID: string;

    @Column({ type: 'float', default: 20 })
    CTRL_REQ_PCT: number;

    @Column({ type: 'float', default: 10 })
    LEAD_REQ_PCT: number;
}
