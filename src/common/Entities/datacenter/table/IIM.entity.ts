import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'IIM', schema: 'AMECMFG' })
export class IIM {
    @PrimaryColumn()
    IID: string;

    @PrimaryColumn()
    IPROD: string;

    @Column()
    IDESC: string;

    @Column()
    IADJ: number;

    @Column()
    IRCT: number;

    @Column()
    IISS: number;

    @Column()
    IOPB: number;

    @Column()
    IYISS: number;

    @Column()
    IYTDU: number;

    @Column()
    IYSLS: number;

    @Column()
    IMSLS: number;

    @Column()
    ICLAS: string;

    @Column()
    IUMS: string;

    @Column()
    IUMP: string;

    @Column()
    IUMCN: number;

    @Column()
    IITYP: string;

    @Column()
    ILEAD: number;

    @Column()
    IVEND: number;

    @Column()
    IVEN2: number;

    @Column()
    ICUSA: number;

    @Column()
    IPRDA: number;

    @Column()
    IMIN: number;

    @PrimaryColumn()
    ILDTE: number;

    @Column()
    ILIST: number;

    @Column()
    ISCST: number;

    @Column()
    IACST: number;

    @Column()
    IFCST: number;

    @Column()
    ILEVL: number;

    @Column()
    IONOD: number;

    @Column()
    IDISC: string;

    @Column()
    INSEQ: number;

    @Column()
    ITSEQ: number;

    @Column()
    ICYC: number;

    @Column()
    IDRAW: string;

    @Column()
    IMTDU: number;

    @Column()
    IMRP: string;

    @Column()
    IACT: string;

    @Column()
    IORDP: string;

    @Column()
    IYRCT: number;

    @Column()
    ILOTS: number;

    @Column()
    IYADJ: number;

    @Column()
    IMCOS: number;

    @Column()
    IYCOS: number;

    @Column()
    IMUST: string;

    @Column()
    IORDC: number;

    @Column()
    IAVEU: number;

    @Column()
    IDSCE: string;

    @Column()
    IWGHT: number;

    @Column()
    IABBT: string;

    @Column()
    IABC: string;

    @Column()
    IPFDV: string;

    @Column()
    IPACK: number;

    @Column()
    ILABL: number;

    @Column()
    IDRF: string;

    @Column()
    ICLNG: number;

    @Column()
    ICWID: number;

    @Column()
    IPITM: string;

    @Column()
    ISITM: string;

    @Column()
    IBUYC: string;

    @Column()
    IFENO: number;

    @Column()
    IUMR: string;

    @Column()
    IUMRC: number;

    @Column()
    IFII: string;

    @Column()
    TAXC1: string;

    @Column()
    SAFLG: number;

    @Column()
    IIOQ: number;

    @Column()
    IBTCH: number;

    @Column()
    IYUSE: number;

    @Column()
    ICYCF: string;

    @Column()
    IPERS: number;

    @Column()
    ISTYL: number;

    @Column()
    IPODY: number;

    @Column()
    ITFDY: number;

    @Column()
    ICST1: number;

    @Column()
    ICST2: number;

    @Column()
    ICST3: number;

    @Column()
    ICST4: number;

    @Column()
    ICST5: number;

    @Column()
    ICST6: number;

    @Column()
    ICST7: number;

    @Column()
    ICST8: number;

    @Column()
    ICST9: number;

    @Column()
    ICSP1: number;

    @Column()
    ICSP2: number;

    @Column()
    ICSP3: number;

    @Column()
    ICSP4: number;

    @Column()
    ICSP5: number;

    @Column()
    ICSP6: number;

    @Column()
    ICSP7: number;

    @Column()
    ICSP8: number;

    @Column()
    ICSP9: number;

    @Column()
    ICFT1: number;

    @Column()
    ICFT2: number;

    @Column()
    ICFT3: number;

    @Column()
    ICFT4: number;

    @Column()
    ICFT5: number;

    @Column()
    ICFT6: number;

    @Column()
    ICFT7: number;

    @Column()
    ICFT8: number;

    @Column()
    ICFT9: number;

    @Column()
    ICFP1: number;

    @Column()
    ICFP2: number;

    @Column()
    ICFP3: number;

    @Column()
    ICFP4: number;

    @Column()
    ICFP5: number;

    @Column()
    ICFP6: number;

    @Column()
    ICFP7: number;

    @Column()
    ICFP8: number;

    @Column()
    ICFP9: number;

    @Column()
    ICAT1: number;

    @Column()
    ICAT2: number;

    @Column()
    ICAT3: number;

    @Column()
    ICAT4: number;

    @Column()
    ICAT5: number;

    @Column()
    ICAT6: number;

    @Column()
    ICAT7: number;

    @Column()
    ICAT8: number;

    @Column()
    ICAT9: number;

    @Column()
    ICAP1: number;

    @Column()
    ICAP2: number;

    @Column()
    ICAP3: number;

    @Column()
    ICAP4: number;

    @Column()
    ICAP5: number;

    @Column()
    ICAP6: number;

    @Column()
    ICAP7: number;

    @Column()
    ICAP8: number;

    @Column()
    ICAP9: number;

    @Column()
    ISCT1: number;

    @Column()
    ISCT2: number;

    @Column()
    ISCT3: number;

    @Column()
    ISCT4: number;

    @Column()
    ISCT5: number;

    @Column()
    ISCT6: number;

    @Column()
    ISCT7: number;

    @Column()
    ISCT8: number;

    @Column()
    ISCT9: number;

    @Column()
    ISCP1: number;

    @Column()
    ISCP2: number;

    @Column()
    ISCP3: number;

    @Column()
    ISCP4: number;

    @Column()
    ISCP5: number;

    @Column()
    ISCP6: number;

    @Column()
    ISCP7: number;

    @Column()
    ISCP8: number;

    @Column()
    ISCP9: number;

    @Column()
    IFRFG: string;

    @Column()
    ISACT: string;

    @Column()
    IUMAT: number;

    @Column()
    IVULI: number;

    @Column()
    IVULP: number;

    @Column()
    INCCFG: string;

    @Column()
    IWHS: string;

    @Column()
    ISOFL: string;

    @Column()
    ILCC: number;

    @Column()
    IJIT: string;

    @Column()
    IUNCN: number;

    @Column()
    IMAXR: number;

    @Column()
    IMINR: number;

    @Column()
    IPCTK: number;

    @Column()
    IGTEC: string;

    @Column()
    IMAXP: number;

    @Column()
    IMTDP: number;

    @Column()
    IYTDP: number;

    @Column()
    ITGQY: number;

    @Column()
    IARRT: number;

    @Column()
    IMXIN: number;

    @Column()
    IDMTF: number;

    @Column()
    IDMC1: string;

    @Column()
    IDMC2: string;

    @Column()
    IMBHD: number;

    @Column()
    IMBDY: number;

    @Column()
    IDLTR: number;

    @Column()
    IMQDY: number;

    @Column()
    IMBWT: number;

    @Column()
    IMPOT: number;

    @Column()
    IMUSC: string;

    @Column()
    IMUMB: string;

    @Column()
    IMUMA: string;

    @Column()
    IPURC: string;

    @Column()
    IMSUM: string;

    @Column()
    IBUSY: string;

    @Column()
    IDSCR: string;

    @Column()
    IMPSD: string;

    @Column()
    ILOC: string;

    @Column()
    IMCOM: string;

    @Column()
    IGLNO: string;

    @Column()
    IFCI: string;
}
