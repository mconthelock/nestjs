import { JoinColumn, OneToOne, ViewColumn, ViewEntity } from 'typeorm';
import { KITTING_LABEL } from '../table/KITTING_LABEL.entity';

@ViewEntity({ name: 'V_KITTING_EVENT_LOG', schema: 'WORKLOAD' })
export class KITTING_EVENT_LOG {
    @ViewColumn()
    ORDER_NO: string;

    @ViewColumn()
    PACKING_NO: string;

    @ViewColumn()
    QR_CODE: string;

    @ViewColumn()
    PRINT_SEQ: number;

    @ViewColumn()
    PRINT_QTY: number;

    @ViewColumn()
    PRINT_STATUS: number;

    @ViewColumn()
    EVENT_TYPE: string;

    @ViewColumn()
    EVENT_BY: string;

    @ViewColumn()
    EVENT_AT: Date;

    @ViewColumn()
    ERROR_MESSAGE: string;

    @OneToOne(() => KITTING_LABEL, (k) => k.QR_CODE)
    @JoinColumn([{ name: 'ERROR_MESSAGE', referencedColumnName: 'QR_CODE' }])
    KITTINGLABEL: KITTING_LABEL;
}
