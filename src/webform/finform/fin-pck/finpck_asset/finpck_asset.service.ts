import { Injectable  } from '@nestjs/common';
import { CreateFinpckAssetDto } from './dto/create-finpck_asset.dto';
import { UpdateFinpckAssetDto } from './dto/update-finpck_asset.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { FinpckAssetRepository } from './finpck_asset.repository';

@Injectable()
export class FinpckAssetService {
  constructor(private readonly repo: FinpckAssetRepository) {}

  // รับ Parameter ตัวแรกเป็น FormDto และตัวที่สองเป็น Array ข้อมูลจาก Excel
  async createMultipleAssets(formDto: FormDto, assetsPayload: any[]) {
     try {
    // 1. Destructuring ค่าออกมาจาก formDto ได้อย่างปลอดภัย
    const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO } = formDto;

    // 2. เรียกหา MAX ID โดยโยนค่าที่ดึงมาเข้าไป
    const currentMaxId = await this.repo.getMaxId(
        NFRMNO, 
        VORGNO, 
        CYEAR, 
        CYEAR2, 
        NRUNNO
    );

    let runningId = currentMaxId;

    // 3. วนลูปสร้างข้อมูล
    const assetsToInsert = assetsPayload.map((item) => {
      runningId += 1; // รันเลข ID ต่อจากค่า Max
      
      return {
        // ใช้ค่าจาก FormDto เป็นหัวขบวน
        ...formDto,
        ...item,
        ID: runningId, 
      };
    });

    const res =  await this.repo.bulkInsertAssets(assetsToInsert);
    if(!res){
                throw new Error('Failed to insert FINPCK_ASSET');
    }
    return {
                status: true,
                message: 'Insert FINPCK_ASSET Successfully',
            };
    } catch (error) {
            throw new Error('Insert FINPCK_ASSET Error: ' + error.message);
    }

  }

  update(id: number, updateFinpckAssetDto: UpdateFinpckAssetDto) {
    return `This action updates a #${id} finpckAsset`;
  }

  create(createFinpckAssetDto: CreateFinpckAssetDto) {
    return 'This action adds a new finpckAsset';
  }

  findAll() {
    return `This action returns all finpckAsset`;
  }

  findOne(id: number) {
    return `This action returns a #${id} finpckAsset`;
  }



  remove(id: number) {
    return `This action removes a #${id} finpckAsset`;
  }
}
