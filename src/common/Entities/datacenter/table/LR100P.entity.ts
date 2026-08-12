// LR101	CHAR
// LR102	VARCHAR2
// LR103	CHAR
// LR104	VARCHAR2
// LR105	VARCHAR2
// LR106	VARCHAR2
// LR107	VARCHAR2
// LR108	VARCHAR2
// LR109	CHAR
// LR110	CHAR
// LR111	VARCHAR2

import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'LR100P', schema: 'AMECMFG' })
export class LR100P {
    @Column()
    LR101: string;

    @Column()
    LR102: string;

    @Column()
    LR103: string;

    @Column()
    LR104: string;

    @Column()
    LR105: string;

    @Column()
    LR106: string;

    @Column()
    LR107: string;

    @Column()
    LR108: string;

    @Column()
    LR109: string;

    @Column()
    LR110: string;

    @Column()
    LR111: string;
}
