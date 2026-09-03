import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'IS_DEVICEMST',
    schema: 'WEBFORM',
})
export class IS_DEVICEMST {
    @PrimaryColumn()
    DNO: number;

    @Column()
    DEVICE: string;

    @Column()
    STATUS: string;

    @Column()
    DEPRECIATION: string;

    @Column()
    TYPE_BRINGOUT: string;

    @Column()
    STANDARD_COST: number;
}
