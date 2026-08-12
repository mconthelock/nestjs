// LR201	CHAR
// LR202	VARCHAR2
// LR203	CHAR
// LR204	VARCHAR2
// LR205	VARCHAR2
// LR206	VARCHAR2
// LR207	VARCHAR2
// LR208	VARCHAR2
// LR209	CHAR
// LR210	CHAR
// LR211	CHAR
// LR212	CHAR
// LR213	CHAR
// LR214	CHAR
// LR215	CHAR
import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'LR200P', schema: 'AMECMFG' })
export class LR200P {
    @Column()
    LR201: string;

    @Column()
    LR202: string;

    @Column()
    LR203: string;

    @Column()
    LR204: string;

    @Column()
    LR205: string;

    @Column()
    LR206: string;

    @Column()
    LR207: string;

    @Column()
    LR208: string;

    @Column()
    LR209: string;

    @Column()
    LR210: string;

    @Column()
    LR211: string;

    @Column()
    LR212: string;

    @Column()
    LR213: string;

    @Column()
    LR214: string;

    @Column()
    LR215: string;
}
