import { Injectable } from '@nestjs/common';
import { CreateIetsFormDto } from './dto/create-iets_form.dto';
import { UpdateIetsFormDto } from './dto/update-iets_form.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { IetsFormRepository } from './iets_form.repository';
import { IetsListRepository } from '../iets_list/iets_list.repository';

@Injectable()
export class IetsFormService {
    constructor(
        private readonly repo: IetsFormRepository,
        private readonly repolist: IetsListRepository,
    ) {}
    async getData(dto: FormDto) {
        try {
            const data = await this.repo.getData(dto);
            if (data && data.LISTS && data.LISTS.length > 0) {
                const dwgNos = [
                    ...new Set(
                        data.LISTS.map((item) =>
                            item.DWGNO ? item.DWGNO.trim() : null,
                        ).filter((dwg) => dwg !== null),
                    ),
                ];
                if (dwgNos.length > 0) {
                    const requestDate = data.FORM?.DREQDATE;
                    const histories =
                        await this.repolist.getLatestRequestsByDwgNos(
                            dwgNos,
                            requestDate,
                        );
                    // 2.4 นำผลลัพธ์มาสร้าง Map (Object)
                    // เพิ่มการเช็คว่า histories มีค่าและเป็น Array แน่นอน
                    // 2.4 นำผลลัพธ์มาสร้าง Map (Object) แบบปลอดภัยขั้นสุด
                    const historyMap = (histories || []).reduce((acc, curr) => {
                        // 🛡️ 1. ป้องกัน Error "Cannot read properties of undefined"
                        // ถ้า curr เป็น undefined หรือ null ให้ข้ามไปเลยทันที
                        if (!curr) {
                            return acc;
                        }

                        // 🛡️ 2. ดึงค่า dwgNo (เผื่อ Oracle ส่งมาเป็นพิมพ์ใหญ่หรือพิมพ์เล็ก)
                        const rawDwgNo = curr.DWGNO ?? curr.dwgNo;

                        // ถ้าไม่มีค่า dwgNo ให้ข้ามไปเลย
                        if (!rawDwgNo) {
                            return acc;
                        }

                        const key = rawDwgNo.trim();

                        // 🛡️ 3. ดึงค่าวันที่ และป้องกันกรณีเป็น null ด้วย ??
                        const maxApvDate =
                            curr.MAXAPVDATE ?? curr.maxApvDate ?? null;

                        acc[key] = maxApvDate;
                        return acc;
                    }, {});
                    data.LISTS = data.LISTS.map((item) => {
                        if (item.DWGNO) {
                            const key = item.DWGNO.trim();
                            item['HISTORY'] = item['HISTORY'] =
                                historyMap[key]?.MAXAPVDATE || null;
                        }
                        return item;
                    });
                }
            }
            console.log(data);

            return data;
        } catch (error) {
            throw new Error('Get IE-TS Form Error: ' + error.message);
        }
    }

    create(createIetsFormDto: CreateIetsFormDto) {
        return 'This action adds a new ietsForm';
    }

    findAll() {
        return `This action returns all ietsForm`;
    }

    findOne(id: number) {
        return `This action returns a #${id} ietsForm`;
    }

    update(id: number, updateIetsFormDto: UpdateIetsFormDto) {
        return `This action updates a #${id} ietsForm`;
    }

    remove(id: number) {
        return `This action removes a #${id} ietsForm`;
    }
}
