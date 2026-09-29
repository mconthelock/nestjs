import { Injectable } from '@nestjs/common';
import { CreateIsCboDto } from './dto/create-is-cbo.dto';
import { UpdateIsCboDto } from './dto/update-is-cbo.dto';
import { IsCboRepository } from './is-cbo.reportsitory';

@Injectable()
export class IsCboService {
    constructor(private readonly cbo: IsCboRepository) {}

    async getListBringOut(vreqno: string) {
        return this.cbo.getListBringOut(vreqno);
    }
    
    async getDevice(uid: string) {
        return this.cbo.getDevice(uid);
    }
}
