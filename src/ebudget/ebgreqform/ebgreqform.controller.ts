import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EbgreqformService } from './ebgreqform.service';

@Controller('ebgreqform')
export class EbgreqformController {
  constructor(private readonly ebgreqformService: EbgreqformService) {}

}
