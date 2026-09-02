import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'K850MP', schema: 'AMECMFG' })
export class K850MP {
    @Column()
    K85M01: string;

    @PrimaryColumn()
    K85M02: string;

    @Column()
    K85M03: string;

    @Column()
    K85M04: string;

    @Column()
    K85M05: string;

    @Column()
    K85M06: string;

    @Column()
    K85M07: string;

    @Column()
    K85M08: string;

    @Column()
    K85M09: string;

    @Column()
    K85M10: string;
}
