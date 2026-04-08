import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { QAINS_FORM } from '../../webform/table/QAINS_FORM.entity';
import { USERS_AUTHORIZE_VIEW } from '../views/USERS_AUTHORIZE_VIEW.entity';

// import { ESCSUserAuthorizeView } from 'src/escs/user-authorize-view/entities/user-authorize-view.entity';
@Entity({
    name: 'ITEM_STATION',
    schema: 'ESCCHKSHT',
})
export class ITEM_STATION {
    @PrimaryColumn()
    ITS_ITEM: string;

    @PrimaryColumn()
    ITS_NO: number;

    @Column()
    ITS_STATION_NAME: string;

    @Column()
    ITS_USERUPDATE: number;

    @Column()
    ITS_DATEUPDATE: Date;

    @OneToOne(() => USERS_AUTHORIZE_VIEW, (s) => s.STATION)
    AUTHORIZE_VIEW: USERS_AUTHORIZE_VIEW;

    @ManyToOne(() => QAINS_FORM, (f) => f.ITEM_STATION)
    @JoinColumn({ name: 'ITS_ITEM', referencedColumnName: 'QA_ITEM' })
    QAINSFORM: QAINS_FORM | null;
}
