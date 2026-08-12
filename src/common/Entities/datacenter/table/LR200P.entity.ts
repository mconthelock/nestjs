// LR201	CHAR [Dept code]
// LR202	VARCHAR2 [Dept name]
// LR203	CHAR [employee code]
// LR204	VARCHAR2 [pre-name]
// LR205	VARCHAR2 [name]
// LR206	VARCHAR2 [pre en]
// LR207	VARCHAR2 [name en]
// LR208	VARCHAR2 [position name]
// LR209	CHAR [work date]
// LR210	CHAR [time in]
// LR211	CHAR [time out]
// LR212	CHAR [time ot]
// LR213	CHAR [x1.3]
// LR214	CHAR [x1.5]
// LR215	CHAR [x3.0]
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
