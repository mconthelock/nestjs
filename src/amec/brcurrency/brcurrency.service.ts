import { Injectable } from '@nestjs/common';
import { CreateBrcurrencyDto } from './dto/create-brcurrency.dto';
import { UpdateBrcurrencyDto } from './dto/update-brcurrency.dto';
import { BrcurrencyRepository } from './brcurrency.repository';

@Injectable()
export class BrcurrencyService {
    constructor(private readonly repo: BrcurrencyRepository) {}

    findCurrency() {
        return this.repo.findCurrency();
    }
}
