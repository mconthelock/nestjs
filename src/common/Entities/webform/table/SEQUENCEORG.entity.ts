import { Entity, PrimaryColumn } from 'typeorm';
@Entity({
    name: 'SEQUENCEORG',
    schema: 'WEBFORM',
})
export class SEQUENCEORG {
    @PrimaryColumn()
    EMPNO: string;

    @PrimaryColumn()
    SPOSCODE: string;

    @PrimaryColumn()
    CCO: string;

    @PrimaryColumn()
    HEADNO: string;

    @PrimaryColumn()
    SPOSCODE1: string;

    @PrimaryColumn()
    CCO1: string;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    VORGNO1: string;
}
