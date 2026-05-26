import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'GPRB_STAMP_CONFIG',
    schema: 'WEBFORM',
})
export class GPRB_STAMP_CONFIG {
    @PrimaryColumn()
    SPOSCODE: string;

    @Column()
    SIZE_MM: number;

    @Column()
    ACTIVE: string;

    @Column()
    STAMP_TYPE: string;
}
