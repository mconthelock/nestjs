import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EbgreqformService } from './ebgreqform.service';

@Controller('ebudget/form')
export class EbgreqformController {
  constructor(private readonly ebgreqformService: EbgreqformService) {}

}
