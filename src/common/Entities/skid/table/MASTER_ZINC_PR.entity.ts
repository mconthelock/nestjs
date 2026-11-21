import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'MASTER_ZINC_PR', schema: 'SKIDCNTRL' })
export class MASTER_ZINC_PR {
    @PrimaryColumn({ length: 100 })
    PROCESS: string;

    @PrimaryColumn({ length: 100 })
    ITEM_MASTER: string;

    @PrimaryColumn({ length: 100 })
    ITEM: string;
}
