import { Entity, PrimaryColumn, Column, ViewEntity, ViewColumn } from 'typeorm';
// @Entity('SEQUENCEORG')
@ViewEntity({
  name: 'SEQUENCEORG',
  expression: `SELECT * FROM SEQUENCEORG`
})
export class SequenceOrg {
    @ViewColumn()
    EMPNO: string;

    @ViewColumn()
    SPOSCODE: string;

    @ViewColumn()
    CCO: string;

    @ViewColumn()
    HEADNO: string;

    @ViewColumn()
    SPOSCODE1: string;

    @ViewColumn()
    CCO1: string;

    @ViewColumn()
    VORGNO: string;

    @ViewColumn()
    VORGNO1: string;
}
