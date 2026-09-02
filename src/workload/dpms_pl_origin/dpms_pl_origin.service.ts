import { Injectable } from '@nestjs/common';
import { DpmsPlOriginRepository } from './dpms_pl_origin.repository';
import { CreateDpmsPlOriginDto } from './dto/create-dpms_pl_origin.dto';

@Injectable()
export class DpmsPlOriginService {
    constructor(private readonly repo: DpmsPlOriginRepository) {}

    async find({
        order,
        type,
        id,
    }: {
        order?: string;
        type?: 'order' | 'case' | 'detail';
        id?: number;
    }) {
        try {
            let res = null;
            switch (type) {
                case 'order':
                    res = await this.repo.getOrderOrigin(order);
                    break;
                case 'case':
                    res = await this.repo.getCaseOrigin(order);
                    break;
                case 'detail':
                    res = await this.repo.getDetailOrigin(order);
                    break;
                default:
                    res = await this.repo.getOriginById(id);
            }
            if (!res || (Array.isArray(res) && res.length === 0)) {
                return {
                    status: false,
                    message: 'No data found',
                };
            }
            return {
                status: true,
                message: `Data found ${Array.isArray(res) ? res.length : 1} records`,
                data: res,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async create(dto: CreateDpmsPlOriginDto | CreateDpmsPlOriginDto[]) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                return {
                    status: false,
                    message: 'Failed to create origin data',
                };
            }
            return {
                status: true,
                message: 'Data created successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    // async editOrigin(id: number) {
    //     try {
    //         const caseRes = await this.find({ type: 2, id });
    //         if (!caseRes.status) {
    //             return caseRes;
    //         }
    //         const detailRes = await this.find({ type: 3, id });
    //         if (!detailRes.status) {
    //             return detailRes;
    //         }
    //         const caseLists = caseRes.data;
    //         const details = detailRes.data;
    //         const data = caseLists.map((caseItem) => {
    //             const caseDetails = details.filter(
    //                 (detailItem) => detailItem.VCASE === caseItem.VCASE,
    //             );
    //             return {
    //                 ...caseItem,
    //                 DETAILS: caseDetails,
    //             };
    //         });
    //         return {
    //             status: true,
    //             message: `Data found ${data.length} records`,
    //             data: data,
    //         };
    //     } catch (error) {
    //         throw new Error(error.message);
    //     }
    // }
}
