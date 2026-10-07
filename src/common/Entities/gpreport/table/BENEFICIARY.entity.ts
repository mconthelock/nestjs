//BENEFICIARY เงินชดเชยกรณีเสียชีวิต
import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'BENEFICIARY', schema: 'GPREPORT' })
export class BENEFICIARY {
    @PrimaryColumn()
    BENEFICIARY_ID: string;

    @PrimaryColumn()
    SEMPNO: string;

    @Column()
    BENEFICIARY_NAME: string;

    @Column()
    RELATIONSHIP: string;

    @Column()
    PERCENTAGE: string;
}
