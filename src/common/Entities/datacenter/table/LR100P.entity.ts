// LR101	CHAR [Dept code]
// LR102	VARCHAR2 [Dept name]
// LR103	CHAR [employee code]
// LR104	VARCHAR2 [pre-name]
// LR105	VARCHAR2 [name]
// LR106	VARCHAR2 [pre en]
// LR107	VARCHAR2 [name en]
// LR108	VARCHAR2 [position name]
// LR109	CHAR [type code]
// LR110	CHAR [leave date]
// LR111	VARCHAR2 [leave value]

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
