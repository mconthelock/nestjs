import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('AVM')
export class Avm {
    @Column()
    
    VNSTAT: string; 
    @Column()
    
	VMID: string; 
    @PrimaryColumn()
    
	VENDOR: number; 
    @Column()
    
	VNDNAM: string; 
    @Column()
    
	VNDAD1: string; 
    @Column()
    
	VNDAD2: string; 
    @Column()
    
	VCITY: string; 
    @Column()
    
	VSTATE: string; 
    @Column()
    
	VPOST: string; 
    @Column()
    
	VTERMS: string; 
    @Column()
    
	VTYPE: string; 
    @Column()
    
	VPAYTO: number; 
    @Column()
    
	VDTLPD: number; 
    @Column()
    
	VDAYCL: number; 
    @Column()
    
	VGL: string; 
    @Column()
    
	V1099: string; 
    @Column()
    
	V1099C: string; 
    @Column()
    
	VPHONE: string; 
    @Column()
    
	VCMPNY: number; 
    @Column()
    
	VCURR: string; 
    @Column()
    
	VPAYTY: string; 
    @Column()
    
	V1TIME: string; 
    @Column()
    
	VCORPV: number; 
    @Column()
    
	VHOLD: string; 
    @Column()
    
	VHOLDT: number; 
    @Column()
    
	VPYTYR: number; 
    @Column()
    
	VDSCAV: number; 
    @Column()
    
	VDSCTK: number; 
    @Column()
    
	VDPURS: number; 
    @Column()
    
	VNNEXT: number; 
    @Column()
    
	VNGEN: string; 
    @Column()
    
	VNALPH: string; 
    @Column()
    
	VNUNAL: number; 
    @Column()
    
	VCON: string; 
    @Column()
    
	VCOUN: string; 
    @Column()
    
	V1099S: number; 
    @Column()
    
	VPAD2: string; 
    @Column()
    
	VPAD1: string; 
    @Column()
    
	VPCTY: string; 
    @Column()
    
	VPSTE: string; 
    @Column()
    
	VPPST: string; 
    @Column()
    
	VPCON: string; 
    @Column()
    
	VPCOU: string; 
    @Column()
    
	VMFRM: number; 
    @Column()
    
	VMMAT: number; 
    @Column()
    
	VTAX: string; 
    @Column()
    
	VPPHN: string; 
    @Column()
    
	VMFSCD: string; 
    @Column()
    
	VMIDNM: string; 
    @Column()
	VTAXCD: string; 
}
