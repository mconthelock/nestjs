import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'VENDING_TOOLS', schema: 'SKIDCNTRL' })
export class VENDING_TOOLS {
    @PrimaryGeneratedColumn()
    V_ID: number;

    @Column()
    CHECK_PERIOD: string;

    @Column()
    PRODUCT_ID: string;

    @Column()
    CREATE_BY: string;

    @Column({ type: 'date', default: () => 'SYSDATE' })
    CREATE_AT: Date;

    @Column()
    UPDATE_BY: string;

    @Column({ type: 'date', default: () => 'SYSDATE' })
    UPDATE_AT: Date;

}
