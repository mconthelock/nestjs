import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'MASTER_ZINC_PR', schema: 'SKIDCNTRL' })
export class MASTER_ZINC_PR {
    @PrimaryColumn({ type: 'varchar2', length: 100 })
    PROCESS: string;

    @PrimaryColumn({ type: 'varchar2', length: 100 })
    ITEM_MASTER: string;

    @PrimaryColumn({ type: 'varchar2', length: 100 })
    ITEM: string;
}