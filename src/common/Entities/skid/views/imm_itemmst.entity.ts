import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'IMM_ITEMMST', schema: 'SKIDCNTRL' })
export class ImmItemmst {
    @PrimaryColumn()
    IID: string;

    @PrimaryColumn()
    IPROD: string;

    @Column()
    IDESC: string;

    @Column()
    IDRAW: string;

    @Column()
    IGLNO: string;

    @Column()
    IITYP: string;

    @Column()
    ILEAD: number;

    @Column()
    IUMS: string;

    @Column()
    IUMP: string;

    @Column()
    IUMCN: number;

    @Column()
    IONOD: number;

    @Column()
    ONHAND: number;

    @Column()
    IABBT: string;

    @Column()
    IPURC: string;

    @Column()
    IBUYC: string;

    @Column()
    BUYER: string;

    @Column()
    BUYERNAME: string;

    @Column()
    BUYERTNAME: string;

    @Column()
    CODE: string;

    @Column()
    ZONE: string;

    @Column()
    USER_ID: string;

    @Column()
    FOREMAN_ID: string;

    @Column()
    ITEM_ADDR: string;

    @Column()
    UPDATE_AT: Date;

    @Column()
    UPDATE_BY: string;

    @Column()
    USER_NAME: string;

    @Column()
    USER_TNAME: string;

    @Column()
    FOREMAN_NAME: string;

    @Column()
    FOREMAN_TNAME: string;
}
