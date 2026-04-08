import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IsCfsService } from './is-cfs.service';
import { CreateIsCfDto } from './dto/create-is-cf.dto';
import { UpdateIsCfDto } from './dto/update-is-cf.dto';

@Controller('is-cfs')
export class IsCfsController {
  constructor(private readonly isCfsService: IsCfsService) {}
}
