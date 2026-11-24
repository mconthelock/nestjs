import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'WHN_GROUP_IP',
    schema: 'INNOVAT',
})
export class WHN_GROUP_IP {
    @PrimaryColumn()
    GRP_ID: number;

    @PrimaryColumn()
    GIP_IP: string;
}