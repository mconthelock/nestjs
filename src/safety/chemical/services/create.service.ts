import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateService {
    constructor() {}

    async main(dto: any, files: Express.Multer.File[]) {

    
        return { dto, files };
    }
}
