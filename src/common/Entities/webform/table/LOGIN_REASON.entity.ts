import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'LOGIN_REASON', schema: 'WEBFORM' })
export class LOGIN_REASON {
    @PrimaryColumn()
    REA_NO: number;

    @PrimaryColumn()
    REA_SEQ: number;

    @Column()
    REA_TEXT: string;
}
