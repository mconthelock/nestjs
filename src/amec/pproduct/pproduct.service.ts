import { Injectable } from '@nestjs/common';
import { CreatePproductDto } from './dto/create-pproduct.dto';
import { UpdatePproductDto } from './dto/update-pproduct.dto';
import { SearchPproductDto } from './dto/search-pproduct.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Pproduct } from './entities/pproduct.entity';


@Injectable()
export class PproductService {
  constructor(
    @InjectRepository(Pproduct, 'webformConnection')
    private productRepo: Repository<Pproduct>,
    @InjectDataSource('webformConnection')
    private ds :DataSource,
  ) {}
  create(createPproductDto: CreatePproductDto) {
    return 'This action adds a new pproduct';
  }

  findAll() {
    return this.productRepo.find();
  }

  findOne(id: string) {
    return this.productRepo.findOne({ where:{SPRODCODE : id}});
  }

  search(dto: SearchPproductDto)
  {
     return this.productRepo.find({ where: dto });
  }

  async createproduct(dto:CreatePproductDto)
  {
    const newProduct = this.productRepo.create(dto);
    return await this.productRepo.save(newProduct);
  }

  async findVendorByProductCode(dto: SearchPproductDto)
  {
      const product = await this.productRepo.find({
      where: { ...dto }, // ค้นหาจาก Product Code ที่ส่งมา
      relations: ['vendor'], // สั่งให้ Join เอาข้อมูลจากตาราง PVENDER มาด้วย (อ้างอิงชื่อ 'vendor' จากใน entity)
    });

    return product;
  }

  async getProductsPagination(dto: SearchPproductDto ,page: number = 1, limit: number = 10)
  {
    const skip = (page-1) * limit;
    const [products, total] = await this.productRepo.findAndCount({
      where: { ...dto }, // ค้นหาจาก Product Code ที่ส่งมา
      relations: ['vendor'], // สั่งให้ Join เอาข้อมูลจากตาราง PVENDER มาด้วย (อ้างอิงชื่อ 'vendor' จากใน entity)
      take:limit,
      skip:skip,
      order:{
        DADDDATE:'DESC',
      }
    });
    const totalPages = Math.ceil(total/limit);
    return {
        data: products,
        meta:{
          totalItems:total,
          itemCount:products.length,
          itemsPerPage: limit,
          totalPages:totalPages,
          currentPage:page,
        },
    }
  }



  // search(sprodcode?: string, prodname?:string)
  // {
  //   const conditions: any = {};
  //    if(sprodcode){
  //       conditions.SPRODCODE = sprodcode;
  //    }
  //   if(prodname){
  //       conditions.SEPRODNAME = prodname;
  //    }

  //   return this.productRepo.find({
  //     where: conditions,
  //   });
  // }

  

  async update(id: string, updatePproductDto: UpdatePproductDto) {
    const result = await this.productRepo.update(id, updatePproductDto);

    // 2. เช็คว่ามีแถวไหนถูกแก้ไหม
    if (result.affected === 0) {
        throw new Error(`ไม่พบสินค้า ID: ${id}`);
    }
  }

  async remove(id: string) {
    const result = await this.productRepo.delete(id);
    if (result.affected === 0) {
            throw new Error(`ไม่พบสินค้า ID: ${id} ให้ลบ`); 
            // หรือ return 404 ตาม Framework ที่ใช้
        }
  }
}
