import { Injectable } from '@nestjs/common';
import { CreateIetsListDto } from './dto/create-iets_list.dto';
import { UpdateIetsListDto } from './dto/update-iets_list.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { RequestIetsListeDto } from './dto/request-iets_list.dto';
import { IetsListRepository } from './iets_list.repository';

@Injectable()
export class IetsListService {
    constructor(private readonly repo: IetsListRepository) {}
    create(createIetsListDto: CreateIetsListDto) {
        return 'This action adds a new ietsList';
    }

    async createMultipleLists(formDto: FormDto, lists: RequestIetsListeDto[]) {
        try {
            const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO } = formDto;
            const currentMaxId = await this.repo.getMaxId(NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO);
            let runningId = currentMaxId;
            // 3. วนลูปสร้างข้อมูล
            const listsToInsert = lists.map((item) => {
                runningId += 1; // รันเลข ID ต่อจากค่า Max

                return {
                    // ใช้ค่าจาก FormDto เป็นหัวขบวน
                    ...formDto,
                    ...item,
                    ID: runningId,
                };
            });

            const res = await this.repo.InsertIets(listsToInsert);
            if (!res) {
                throw new Error('Failed to insert IETS_LIST');
            }
            return {
                status: true,
                message: 'Insert IETS_LIST Successfully',
            };
        } catch (error) {
            throw new Error('Insert IETS_LIST Error: ' + error.message);
        }
    }

    findAll() {
        return `This action returns all ietsList`;
    }

    findOne(id: number) {
        return `This action returns a #${id} ietsList`;
    }

    update(id: number, updateIetsListDto: UpdateIetsListDto) {
        return `This action updates a #${id} ietsList`;
    }

    remove(id: number) {
        return `This action removes a #${id} ietsList`;
    }
}
