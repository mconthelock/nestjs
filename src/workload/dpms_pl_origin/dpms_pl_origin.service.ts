import { Injectable } from '@nestjs/common';
import { DpmsPlOriginRepository } from './dpms_pl_origin.repository';

@Injectable()
export class DpmsPlOriginService {
    constructor(private readonly repo: DpmsPlOriginRepository) {}

    async find(id: number, type?: 1 | 2 | 3) {
        try {
            let res = null;
            switch (type) {
                case 1:
                    res = await this.repo.findByOrder(id);
                    break;
                case 2:
                    res = await this.repo.findByCase(id);
                    break;
                case 3:
                    res = await this.repo.findByDetail(id);
                    break;
                default:
                    res = await this.repo.findById(id);
            }
            if (res.length == 0) {
                return {
                    status: false,
                    message: 'No data found',
                };
            }
            return {
                status: true,
                message: `Data found ${res.length} records`,
                data: res,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async editOrigin(id: number) {
        try {
            const caseRes = await this.find(id, 2);
            if(!caseRes.status){
                return caseRes;
            }
            const detailRes = await this.find(id, 3);
            if(!detailRes.status){
                return detailRes;
            }
            const caseLists = caseRes.data;
            const details = detailRes.data;
            const data = caseLists.map((caseItem) => {
                const caseDetails = details.filter(
                    (detailItem) => detailItem.VCASE === caseItem.VCASE,
                );
                return {
                    ...caseItem,
                    DETAILS: caseDetails,
                };
            });
            return {
                status: true,
                message: `Data found ${data.length} records`,
                data: data,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
