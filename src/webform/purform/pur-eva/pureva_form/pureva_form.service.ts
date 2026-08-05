import { Injectable } from '@nestjs/common';
import { CreatePurevaFormDto } from './dto/create-pureva_form.dto';
import { UpdatePurevaFormDto } from './dto/update-pureva_form.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { PurevaFormRepository } from './pureva_form.repository';

@Injectable()
export class PurevaFormService {
 constructor(private readonly repo: PurevaFormRepository) {}
 async create(dto: CreatePurevaFormDto) {
      try {
            const res = await this.repo.create(dto);
            if(!res){
                throw new Error('Failed to insert PUREVAFORM');
            }
            return {
                status: true,
                message: 'Insert PUREVAFORM Successfully',
            };
        } catch (error) {
            throw new Error('Insert PUREVAFORM Error: ' + error.message);
        }
  }

    async getData(dto: FormDto) {
        try {
            return await this.repo.getData(dto);
        } catch (error) {
            throw new Error('Get PUR-EVA Form Error: ' + error.message);
        }
    }

  findAll() {
    return `This action returns all purevaForm`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purevaForm`;
  }

  async update(con: FormDto , dto: UpdatePurevaFormDto) {
    try {
        const res = await this.repo.update(con, dto);
        if(!res){
            throw new Error('Failed to update PUREVAFORM');
        }
        return {
            status: true,
            message: 'Update PUREVAFORM Successfully',
        };
    } catch (error) {
        throw new Error('Update PUREVAFORM Error: ' + error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} purevaForm`;
  }
}
