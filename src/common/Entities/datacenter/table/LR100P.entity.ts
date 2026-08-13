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

    @PrimaryColumn()
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

    @PrimaryColumn()
    LR109: string;

    @PrimaryColumn({
        type: 'date',
        transformer: {
            to: (value: Date | string | null | undefined) => {
                if (value === null || value === undefined) return value;
                if (value instanceof Date) return value;
                return new Date(
                    `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`,
                );
            },
            from: (value: Date | string | null | undefined) => {
                if (value === null || value === undefined) return value;
                if (value instanceof Date) return value;
                if (typeof value === 'string' && value.length === 8) {
                    return new Date(
                        `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`,
                    );
                }
                return new Date(value);
            },
        },
    })
    LR110: Date;

    @Column()
    LR111: string;
}
