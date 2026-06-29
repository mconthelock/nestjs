import { Injectable } from '@nestjs/common';
import { CreateFinpckFormDto } from './dto/create-finpck_form.dto';
import { UpdateFinpckFormDto } from './dto/update-finpck_form.dto';
import { FinpckFormRepository } from './finpck_form.repository';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class FinpckFormService {
  constructor(private readonly repo: FinpckFormRepository) {}
  async create(dto: CreateFinpckFormDto) {
          try {
            const res = await this.repo.createForm(dto);
            if(!res){
                throw new Error('Failed to insert FINPCK FORM');
            }
            return {
                status: true,
                message: 'Insert FINPCK FORM Successfully',
            };
        } catch (error) {
            throw new Error('Insert FINPCK FORM Error: ' + error.message);
        }
  }

  async getData(dto: FormDto) {
        try {
            return await this.repo.getData(dto);
        } catch (error) {
            throw new Error('Get PUR-NVF Form Error: ' + error.message);
        }
    }

  

  findAll() {
    return `This action returns all finpckForm`;
  }

  findOne(id: number) {
    return `This action returns a #${id} finpckForm`;
  }

  update(id: number, updateFinpckFormDto: UpdateFinpckFormDto) {
    return `This action updates a #${id} finpckForm`;
  }

  remove(id: number) {
    return `This action removes a #${id} finpckForm`;
  }
}
