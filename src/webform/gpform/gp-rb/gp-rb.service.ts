import { Injectable } from '@nestjs/common';
import { CreateGpRbDto } from './dto/create-gp-rb.dto';
import { UpdateGpRbDto } from './dto/update-gp-rb.dto';
import { GpRbRepository } from './gp-rb.repository';


@Injectable()
export class GpRbService {
  constructor(
    private readonly repo:GpRbRepository,
  ){}
  findAll(){
    return this.repo.findAll();
  }

}