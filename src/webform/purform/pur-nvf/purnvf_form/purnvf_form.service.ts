import { Injectable } from '@nestjs/common';
import { CreatePurnvfFormDto } from './dto/create-purnvf_form.dto';
import { UpdatePurnvfFormDto } from './dto/update-purnvf_form.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { PurnvfFormRepository } from './purnvf_form.repository';

@Injectable()
export class PurnvfFormService {
   constructor(private readonly repo: PurnvfFormRepository) {}
 async create(dto: CreatePurnvfFormDto) {
      try {
            const res = await this.repo.create(dto);
            if(!res){
                throw new Error('Failed to insert PURVNFFORM');
            }
            return {
                status: true,
                message: 'Insert PURVNFFORM Successfully',
            };
        } catch (error) {
            throw new Error('Insert PURVNFFORM Error: ' + error.message);
        }
  }
  async getData(dto: FormDto) {
        try {
            return await this.repo.getData(dto);
        } catch (error) {
            throw new Error('Get PUR-NVF Form Error: ' + error.message);
        }
    }

  async searchByKeyword(keyword: string) {
        try {
            return await this.repo.searchForms(keyword);
        } catch (error) {
            throw new Error('Get PUR-NVF Form Error: ' + error.message);
        }
    }

  findAll() {
    return `This action returns all purnvfForm`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purnvfForm`;
  }

  update(id: number, updatePurnvfFormDto: UpdatePurnvfFormDto) {
    return `This action updates a #${id} purnvfForm`;
  }

  remove(id: number) {
    return `This action removes a #${id} purnvfForm`;
  }
}
