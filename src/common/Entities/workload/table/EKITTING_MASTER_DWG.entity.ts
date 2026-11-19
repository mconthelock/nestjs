import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'EKITTING_MASTER_DWG', schema: 'WORKLOAD' })
export class EKittingMasterDwg {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    ITEM: string;

    @Column()
    DWG: string;

    @Column()
    CREATED_BY: string;

    @Column()
    CREATED_AT: Date;
}
