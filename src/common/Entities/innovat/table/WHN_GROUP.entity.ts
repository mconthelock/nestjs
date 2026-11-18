import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'WHN_GROUP',
    schema: 'INNOVAT',
})
export class WHN_GROUP {
    @PrimaryColumn()
    GRP_ID: number;

    @Column()
    GRP_DETAIL: string;

    @Column()
    GRP_PRIORITY: number;
}