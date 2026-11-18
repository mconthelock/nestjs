import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'STY_CHEMICAL_FILES', schema: 'GPREPORT' })
export class STY_CHEMICAL_FILES {
    @PrimaryColumn()
    FILE_ID: number;

    @PrimaryColumn()
    AMEC_SDS_ID: number;
}
