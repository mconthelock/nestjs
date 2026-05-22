import { Injectable } from '@nestjs/common';
import { CreatePtermcodeDto } from './dto/create-ptermcode.dto';
import { UpdatePtermcodeDto } from './dto/update-ptermcode.dto';
import { PtermRepository } from './ptermcode.repository';
@Injectable()
export class PtermcodeService {
  constructor(private readonly repo : PtermRepository) {}
  findTermcode() {
    return this.repo.findTermcode();
  } 
}