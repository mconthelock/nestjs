import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'WHN_PROCESS',
    schema: 'INNOVAT',
})
export class WHN_PROCESS {
    @Column()
    GRP_ID: string;

    @PrimaryColumn()
    PRC_CODE: string;
}
