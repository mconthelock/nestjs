import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Items } from './entities/items.entity';
import { searchItemsDto } from './dto/searchItems.dto';
import { createItemsDto } from './dto/createItems.dto';
import { updateItemsDto } from './dto/updateItems.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Items, 'spsysConnection')
    private readonly items: Repository<Items>,
  ) {}

  async findAll(query: searchItemsDto) {
    const qb = this.items
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .leftJoinAndSelect('item.prices', 'price')
      .leftJoinAndSelect('item.itemscustomer', 'itemcus');

    let drawing = undefined;
    if (query.ITEM_DWG !== undefined) {
      drawing = query.ITEM_DWG;
      delete query.ITEM_DWG;
    }

    let variable = undefined;
    if (query.ITEM_VARIABLE !== undefined) {
      variable = query.ITEM_VARIABLE;
      delete query.ITEM_VARIABLE;
    }

    Object.entries(query).forEach(([key, value]) => {
      if (!value) return;
      console.log(key, value);

      if (key === 'ITEM_NAME') {
        qb.andWhere(`item.${key} LIKE :${key}`, { [key]: `${value}%` });
      } else {
        qb.andWhere(`item.${key} = :${key}`, { [key]: value });
      }
    });
    let result = await qb.getMany();

    try {
      if (drawing !== undefined) {
        const dwg = await this.validateDrawingNo(drawing);
        result = result.filter((x) => x.ITEM_DWG == dwg);
      }

      if (variable !== undefined) {
        const vars = await this.validateVariable(variable);
        if (!vars.isValid) throw 'Invalid Variable';
        return this.compareVariable(result, vars.parsedData);
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return result;
  }

  async validateDrawingNo(input) {
    if (!input || typeof input !== 'string') return null;
    // ลบช่องว่างทั้งหมดก่อน
    let dwg = input.replace(/\s+/g, '');
    // 1. กรณีขึ้นต้นด้วย X และตัวที่ 6 เป็น G หรือ -
    if (dwg.startsWith('X') && dwg.length > 6 && /[G\-]/.test(dwg[5])) {
      return dwg.slice(0, 5) + ' ' + dwg.slice(5);
    }

    // 2. กรณีความยาวตรงเงื่อนไข และตำแหน่งที่กำหนดมี G หรือ -
    const lengthBasedRules = [
      { length: 8, checkIndex: 5 },
      { length: 9, checkIndex: 6 },
      { length: 10, checkIndex: 7 },
      { length: 11, checkIndex: 8 },
    ];
    for (const rule of lengthBasedRules) {
      if (dwg.length === rule.length && /[G\-]/.test(dwg[rule.checkIndex])) {
        return dwg.slice(0, rule.checkIndex) + ' ' + dwg.slice(rule.checkIndex);
      }
    }

    dwg = await this.formatDrawingNo(input);
    const fullPattern = /^([A-Z0-9]{8,9}) ([G\-][0-9]{2})((?: L[0-9]{2,3})*)$/;
    if (fullPattern.test(dwg)) {
      const spaceMatch = dwg.match(/ /g);
      const firstSpaceIndex = dwg.indexOf(' ');
      if (spaceMatch && spaceMatch.length > 1 && firstSpaceIndex !== -1) {
        dwg =
          dwg.slice(0, firstSpaceIndex) +
          ' ' +
          dwg.slice(firstSpaceIndex + 1).replace(/\s+/g, '');
      }
      return dwg;
    }

    if (dwg.length >= 5 && dwg.length <= 13) {
      return dwg;
    }
    throw new InternalServerErrorException('Drawing Format is not match');
  }

  async formatDrawingNo(input) {
    const basePattern = /^([A-Z0-9\-]{8,9})\s*([G\-][0-9]{2})(.*)$/;
    const match = input.match(basePattern);
    if (!match) return input;

    const dwgno = match[1];
    const gno = match[2];
    const lno = match[3] || '';
    const lval = [...lno.matchAll(/L[0-9]{2,3}/g)].map((m) => m[0]);
    return [dwgno, gno, ...lval].join(' ');
  }

  async validateVariable(inputString) {
    if (inputString.endsWith(',')) {
      inputString = inputString.slice(0, -1);
    }
    let cleanedString = inputString.replace(/\s/g, '');
    const pairRegex = /([^=,]{1,3})=((?:[^,]+|,(?![^=,]{1,3}=))+)/g;
    let isValid = true;
    const errors = [];
    const parsedData = {};
    let lastIndex = 0;
    const matches = [...cleanedString.matchAll(pairRegex)];
    if (matches.length === 0 && cleanedString.length > 0) {
      isValid = false;
      errors.push('รูปแบบสตริงไม่ถูกต้อง: ไม่พบรูปแบบ KEY=VALUE ที่ถูกต้อง.');
      return { isValid, errors, parsedData };
    }

    for (const match of matches) {
      const fullMatch = match[0];
      const key = match[1];
      const value = match[2];

      if (match.index > lastIndex) {
        const unparsedSegment = cleanedString.substring(lastIndex, match.index);
        if (unparsedSegment !== ',') {
          isValid = false;
          errors.push(
            `รูปแบบสตริงไม่ถูกต้อง: พบส่วนที่ไม่สามารถแยกวิเคราะห์ได้ '${unparsedSegment}' ก่อน '${fullMatch}'`,
          );
          break;
        }
      }
      lastIndex = match.index + fullMatch.length;
      if (key.length < 1 || key.length > 3) {
        isValid = false;
        errors.push(
          `ชื่อตัวแปร '${key}' มีความยาวไม่ถูกต้อง (ต้อง 1-3 ตัวอักษร).`,
        );
      }

      if (!value) {
        isValid = false;
        errors.push(`ค่าของตัวแปร '${key}' ว่างเปล่า.`);
      } else {
        if (!value.includes(',')) {
          if (value.length > 9) {
            isValid = false;
            errors.push(
              `ค่าตัวแปรทั่วไป '${key}=${value}' มีความยาวเกิน 9 ตัวอักษร.`,
            );
          }
        }
      }
      parsedData[key] = value;
    }
    if (lastIndex < cleanedString.length) {
      const remaining = cleanedString.substring(lastIndex);
      isValid = false;
      errors.push(
        `รูปแบบสตริงไม่ถูกต้อง: มีส่วนที่เหลือไม่สามารถแยกวิเคราะห์ได้ '${remaining}'.`,
      );
    }

    return { isValid, errors, parsedData };
  }

  async compareVariable(data, obj2) {
    let obj1 = [];
    for (const item of data) {
      const variable = await this.validateVariable(
        item.ITEM_VARIABLE == null ? '' : item.ITEM_VARIABLE,
      );
      obj1.push({ item, variable: variable.parsedData });
    }

    let res = [];
    let check = true;
    for (const obj of obj1) {
      if (Object.keys(obj.variable).length !== Object.keys(obj2).length)
        check = false;
      for (const key in obj.variable) {
        if (obj.variable[key] !== obj2[key]) check = false;
      }
      if (check) res.push(obj.item);
      check = true;
    }
    return res;
  }

  async createItems(data: createItemsDto) {
    return this.items.save(data);
  }

  async updateItems(data: updateItemsDto) {
    return this.items.save(data);
  }
}
