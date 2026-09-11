import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'WHN_ITEM',
    schema: 'INNOVAT',
})
export class WHN_ITEM {
    @PrimaryColumn()
    ITEM_NO: string;

    @Column()
    ITEM_PROCESS: string;
}