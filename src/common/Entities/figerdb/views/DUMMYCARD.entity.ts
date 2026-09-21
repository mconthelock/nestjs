import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
    name: 'DummyCardView',
    schema: 'dbo',
})
export class DummyCard {
    @ViewColumn()
    Id: number;

    @ViewColumn()
    EmpCode: string;

    @ViewColumn()
    DummyCode: string;

    @ViewColumn()
    StartDate: Date;

    @ViewColumn()
    EndDate: Date;

    @ViewColumn()
    IPBrr: string;

    @ViewColumn()
    IPRet: string;

    @ViewColumn()
    statusDummyCard: string;

    @ViewColumn()
    LostDummyDate: Date;

    @ViewColumn()
    DummyUID: string;
}
