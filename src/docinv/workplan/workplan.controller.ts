import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkplanService } from './workplan.service';

@Controller('workplan')
export class WorkplanController {
  constructor(private readonly workplanService: WorkplanService) {}
}
