import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'WHN_PROCESS',
    schema: 'INNOVAT',
})
export class WHN_PROCESS {
    @PrimaryColumn()
    PRC_CODE: string;

    @Column()
    GRP_ID: string;
}