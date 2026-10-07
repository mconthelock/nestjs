import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'PSUPI_REASON',
    schema: 'WEBFORM',
})
export class PSUPI_REASON {
    @PrimaryColumn()
    REASON_CODE: string;

    @Column()
    REASON_NAME: string;

    @Column()
    ACTIVE: string;

    @Column()
    INPUT_LABEL: string;

    @Column()
    INPUT_REQUIRED: number;
}
